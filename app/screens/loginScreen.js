import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

// Your SVG XML content
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M50,10 C80,20 90,50 50,90 C10,50 20,20 50,10 Z" fill="#2e7d32"/>
  <path d="M50,10 C50,40 70,50 50,90" fill="none" stroke="#4caf50" stroke-width="3"/>
</svg>
`;

const googleLogoSvg = `
<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
        <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.77 8.77 0 0 0 2.68-6.62z" fill="#4285F4"/>
        <path d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.92-2.26a5.4 5.4 0 0 1-8.02-2.8H.96v2.34A9 9 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.98 10.76a5.4 5.4 0 0 1 0-3.52V4.9H.96a9 9 0 0 0 0 8.2l3.02-2.34z" fill="#FBBC05"/>
        <path d="M9 3.6c1.55 0 2.9.54 3.98 1.5l2.6-2.6A9 9 0 0 0 9 0a9 9 0 0 0-8.04 4.9l3.02 2.34a5.4 5.4 0 0 1 5.02-3.64z" fill="#EA4335"/>
    </g>
</svg>
`;

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
            <SvgXml xml={logoSvg} width="100" height="100" />
            <Text style={styles.title}>Ayura</Text>
            <Text style={styles.subtitle}>Welcome back to your herbal journey</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <SvgXml xml={googleLogoSvg} width="24" height="24" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FDF8', // A very light green background
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontFamily: 'Lato-Bold',
    fontSize: 32,
    color: '#2e7d32',
    marginTop: 20,
  },
  subtitle: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4caf50',
    marginTop: 16,
  },
  signupButtonText: {
    color: '#4caf50',
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
    fontFamily: 'Lato-Regular',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Lato-Regular',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
  },
});

export default LoginScreen;