package fabric

import (
    "crypto/x509"
    "fmt"
    "os"
    "path"
    "time"

    "github.com/hyperledger/fabric-gateway/pkg/client"
    "github.com/hyperledger/fabric-gateway/pkg/identity"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials"
)

// GatewayConfig holds all configuration needed for gateway connection
type GatewayConfig struct {
    MSPID         string
    CertPath      string
    KeyPath       string
    TLSCertPath   string
    PeerEndpoint  string
    GatewayPeer   string
    ChannelName   string
    ChaincodeName string
}

// FabricGateway wraps the Fabric Gateway connection and utilities
type FabricGateway struct {
    Config    GatewayConfig
    Gateway   *client.Gateway
    Network   *client.Network
    Contract  *client.Contract
    identity  *identity.X509Identity
    sign      identity.Sign
    grpcConn  *grpc.ClientConn
}

// NewFabricGateway creates a new gateway instance with the given configuration
func NewFabricGateway(config GatewayConfig) (*FabricGateway, error) {
    fg := &FabricGateway{Config: config}

    // Set up the gateway connection
    if err := fg.setup(); err != nil {
        return nil, fmt.Errorf("failed to setup gateway: %w", err)
    }

    return fg, nil
}

// setup initializes all components needed for the gateway
func (fg *FabricGateway) setup() error {
    var err error

    // Create gRPC connection
    fg.grpcConn, err = fg.newGrpcConnection()
    if err != nil {
        return fmt.Errorf("failed to create gRPC connection: %w", err)
    }

    // Create identity
    fg.identity, err = fg.newIdentity()
    if err != nil {
        return fmt.Errorf("failed to create identity: %w", err)
    }

    // Create signer
    fg.sign, err = fg.newSign()
    if err != nil {
        return fmt.Errorf("failed to create signer: %w", err)
    }

    // Connect gateway
    fg.Gateway, err = client.Connect(
        fg.identity,
        client.WithSign(fg.sign),
        client.WithClientConnection(fg.grpcConn),
        client.WithEvaluateTimeout(5*time.Second),
        client.WithEndorseTimeout(15*time.Second),
        client.WithSubmitTimeout(5*time.Second),
        client.WithCommitStatusTimeout(1*time.Minute),
    )
    if err != nil {
        return fmt.Errorf("failed to connect gateway: %w", err)
    }

    // Get network and contract
    fg.Network = fg.Gateway.GetNetwork(fg.Config.ChannelName)
    fg.Contract = fg.Network.GetContract(fg.Config.ChaincodeName)

    return nil
}

// newGrpcConnection creates a gRPC connection to the Gateway server
func (fg *FabricGateway) newGrpcConnection() (*grpc.ClientConn, error) {
    certificatePEM, err := os.ReadFile(fg.Config.TLSCertPath)
    if err != nil {
        return nil, fmt.Errorf("failed to read TLS certificate: %w", err)
    }

    certificate, err := identity.CertificateFromPEM(certificatePEM)
    if err != nil {
        return nil, err
    }

    certPool := x509.NewCertPool()
    certPool.AddCert(certificate)
    transportCreds := credentials.NewClientTLSFromCert(certPool, fg.Config.GatewayPeer)

    connection, err := grpc.NewClient(fg.Config.PeerEndpoint, grpc.WithTransportCredentials(transportCreds))
    if err != nil {
        return nil, fmt.Errorf("failed to create gRPC connection: %w", err)
    }

    return connection, nil
}

// newIdentity creates a client identity for this Gateway connection using an X.509 certificate
func (fg *FabricGateway) newIdentity() (*identity.X509Identity, error) {
    certificatePEM, err := fg.readFirstFile(fg.Config.CertPath)
    if err != nil {
        return nil, fmt.Errorf("failed to read certificate: %w", err)
    }

    certificate, err := identity.CertificateFromPEM(certificatePEM)
    if err != nil {
        return nil, err
    }

    id, err := identity.NewX509Identity(fg.Config.MSPID, certificate)
    if err != nil {
        return nil, err
    }

    return id, nil
}

// newSign creates a function that generates a digital signature from a message digest using a private key
func (fg *FabricGateway) newSign() (identity.Sign, error) {
    privateKeyPEM, err := fg.readFirstFile(fg.Config.KeyPath)
    if err != nil {
        return nil, fmt.Errorf("failed to read private key: %w", err)
    }

    privateKey, err := identity.PrivateKeyFromPEM(privateKeyPEM)
    if err != nil {
        return nil, err
    }

    sign, err := identity.NewPrivateKeySign(privateKey)
    if err != nil {
        return nil, err
    }

    return sign, nil
}

// readFirstFile reads the first file from the given directory
func (fg *FabricGateway) readFirstFile(dirPath string) ([]byte, error) {
    dir, err := os.Open(dirPath)
    if err != nil {
        return nil, err
    }
    defer dir.Close()

    files, err := dir.Readdir(1)
    if err != nil {
        return nil, err
    }

    return os.ReadFile(path.Join(dirPath, files[0].Name()))
}

// Close releases all resources held by the gateway
func (fg *FabricGateway) Close() {
    if fg.Gateway != nil {
        fg.Gateway.Close()
    }
    if fg.grpcConn != nil {
        fg.grpcConn.Close()
    }
}

// Helper methods for different transaction types

// SubmitTransaction submits a transaction to the ledger
func (fg *FabricGateway) SubmitTransaction(fcn string, args ...string) ([]byte, error) {
    return fg.Contract.SubmitTransaction(fcn, args...)
}

// EvaluateTransaction evaluates a transaction without writing to the ledger
func (fg *FabricGateway) EvaluateTransaction(fcn string, args ...string) ([]byte, error) {
    return fg.Contract.EvaluateTransaction(fcn, args...)
}

// Example domain-specific methods for your SIH use case

// RegisterFarmer submits a transaction to register a new farmer
func (fg *FabricGateway) RegisterFarmer(farmerID, name, location string, documents []string) ([]byte, error) {
    return fg.SubmitTransaction("RegisterFarmer", farmerID, name, location, fmt.Sprintf("%v", documents))
}

// CreateBatch creates a new batch of agricultural produce
func (fg *FabricGateway) CreateBatch(batchID, species, weight, location, harvestTime string) ([]byte, error) {
    return fg.SubmitTransaction("CreateBatch", batchID, species, weight, location, harvestTime)
}

// UploadQualityCheck submits quality check results for a batch
func (fg *FabricGateway) UploadQualityCheck(batchID, labID, testResults, timestamp string) ([]byte, error) {
    return fg.SubmitTransaction("UploadQualityCheck", batchID, labID, testResults, timestamp)
}

// GetBatchHistory gets the complete history of a batch
func (fg *FabricGateway) GetBatchHistory(batchID string) ([]byte, error) {
    return fg.EvaluateTransaction("GetBatchHistory", batchID)
}
