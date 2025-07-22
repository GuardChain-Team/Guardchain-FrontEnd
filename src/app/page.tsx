'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  // Removed automatic redirect to /dashboard for authenticated users

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotating stats
  const stats = [
    { value: '99.8%', label: 'Fraud Detection Rate' },
    { value: '<200ms', label: 'Response Time' },
    { value: 'Rp.2.3T', label: 'Protected Daily' },
    { value: '50M+', label: 'Transactions Analyzed' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

if (status === 'loading') {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-8 py-12">
      <div className="text-center">
        <div className="relative flex items-center justify-center">
          <Spinner size="lg" className="z-10" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
        </div>
        <p className="mt-6 text-muted-foreground">Initializing SI JagaDana...</p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 dark:bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300/20 dark:bg-green-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-8 lg:px-12 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SI JagaDana</span>
                <div className="text-xs text-muted-foreground">AI-Powered Security</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-12">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50">Features</a>
              <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50">Security</a>
              <a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50">Analytics</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50">Testimonials</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50">Pricing</a>
            </nav>

            <div className="flex items-center space-x-6">
              <ThemeSwitcher />
              <Button
                variant="ghost"
                onClick={() => router.push('/login')}
                className="hover:bg-muted px-8 py-3"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push('/register')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-216 lg:py-8 overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-left space-y-8">
              {/* <Badge className="mb-8 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 px-6 py-3">
                🚀 Now Supporting BI-FAST & QRIS
              </Badge> */}

              <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                <span className="text-foreground">Next-Gen</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Fraud Detection
                </span>
                <br />
                <span className="text-foreground">for Indonesia</span>
              </h1>

              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Harness the power of AI to protect your financial institution with real-time fraud detection,
                investigation tools, and comprehensive analytics built specifically for Indonesian banking systems.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 pt-4">
                <Button
                  size="lg"
                  onClick={() => router.push('/register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-6 shadow-xl"
                >
                  Start Free Trial
                  <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/demo')}
                  className="text-lg px-12 py-6 border-2 hover:bg-muted"
                >
                  <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Live Demo
                </Button>
              </div>

              {/* Real-time Stats */}
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-border/20 mt-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground font-medium">Live Statistics</span>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-foreground">{stats[currentStat].value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stats[currentStat].label}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Dashboard Preview */}
              <div className="relative bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">Fraud Dashboard</div>
                        <div className="text-blue-100 text-sm">Real-time Monitoring</div>
                      </div>
                    </div>
                    <div className="text-green-300 text-sm font-medium">● ACTIVE</div>
                  </div>
                </div>

                <div className="p-10">
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-xl">
                      <div className="text-red-600 dark:text-red-400 text-3xl font-bold">23</div>
                      <div className="text-red-600 dark:text-red-400 text-sm mt-2">Critical Alerts</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/20 p-8 rounded-xl">
                      <div className="text-green-600 dark:text-green-400 text-3xl font-bold">99.8%</div>
                      <div className="text-green-600 dark:text-green-400 text-sm mt-2">Detection Rate</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-muted/50 rounded-xl">
                      <div className="flex items-center space-x-6">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium">Suspicious Transaction</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/50 rounded-xl">
                      <div className="flex items-center space-x-6">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">Pattern Anomaly</span>
                      </div>
                      <span className="text-xs text-muted-foreground">5 min ago</span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/50 rounded-xl">
                      <div className="flex items-center space-x-6">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">ML Model Updated</span>
                      </div>
                      <span className="text-xs text-muted-foreground">10 min ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-500/20 rounded-full opacity-20 animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 px-6 py-3">
              ⚡ Advanced AI Technology
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-foreground">Why Choose</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> SI JagaDana</span>
              <span className="text-foreground">?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Built specifically for Indonesian banking regulations and fraud patterns,
              powered by cutting-edge AI and machine learning technology that adapts to emerging threats.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50/50 dark:from-blue-950/20 to-card">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl mb-6">Real-time Detection</CardTitle>
                <CardDescription className="text-muted-foreground text-lg leading-relaxed">
                  Advanced ML algorithms analyze transactions in real-time with sub-200ms response times,
                  ensuring immediate fraud detection and prevention across all payment channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <div className="flex items-center space-x-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>99.8% accuracy rate</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50/50 dark:from-purple-950/20 to-card">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl mb-6">Indonesian Compliance</CardTitle>
                <CardDescription className="text-muted-foreground text-lg leading-relaxed">
                  Fully compliant with BI-FAST, QRIS, and GPN systems. Built with Indonesian banking
                  regulations and local fraud patterns in mind for seamless integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <div className="flex items-center space-x-4 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bank Indonesia certified</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50/50 dark:from-green-950/20 to-card">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl mb-6">Advanced Analytics</CardTitle>
                <CardDescription className="text-muted-foreground text-lg leading-relaxed">
                  Comprehensive fraud analytics, investigation tools, and predictive insights
                  to stay ahead of emerging threats with actionable intelligence.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <div className="flex items-center space-x-4 text-sm text-green-600 dark:text-green-400 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Predictive modeling</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Continue with the rest of your sections... */}
      {/* I'll continue with the other sections following the same padding pattern */}
      
      {/* Security Section */}
      <section id="security" className="py-40 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12 relative">
          <div className="text-center mb-24">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3">
              🔒 Bank-Grade Security
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Your data security is our top priority. SI JagaDana employs multiple layers of protection
              to ensure your financial data remains safe and compliant with international standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-6">256-bit SSL</h3>
              <p className="text-blue-100 text-lg leading-relaxed">End-to-end encryption for all data transmission</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-6">SOC 2 Compliant</h3>
              <p className="text-blue-100 text-lg leading-relaxed">Audited security controls and procedures</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-6">Data Residency</h3>
              <p className="text-blue-100 text-lg leading-relaxed">All data stored in Indonesian data centers</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
               <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m13 0h-6m-8-4h6m4 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2V9z" />
               </svg>
             </div>
             <h3 className="text-xl font-semibold mb-6">24/7 Monitoring</h3>
             <p className="text-blue-100 text-lg leading-relaxed">Round-the-clock security monitoring and support</p>
           </div>
         </div>
       </div>
     </section>

     {/* Analytics Section */}
     <section id="analytics" className="py-40 bg-gradient-to-br from-background to-muted/20">
       <div className="container mx-auto px-8 lg:px-12">
         <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
             <Badge className="mb-8 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 px-6 py-3">
               📊 Advanced Analytics
             </Badge>
             <h2 className="text-6xl font-bold leading-tight">
               <span className="text-foreground">Deep Insights with</span>
               <br />
               <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                 AI-Powered Analytics
               </span>
             </h2>
             <p className="text-xl text-muted-foreground leading-relaxed">
               Transform your fraud detection with comprehensive analytics that provide actionable insights, 
               predictive modeling, and detailed investigation tools for maximum protection.
             </p>

             <div className="space-y-10 pt-8">
               <div className="flex items-start space-x-8">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-2">
                   <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-foreground text-2xl mb-3">Real-time Dashboards</h3>
                   <p className="text-muted-foreground text-lg leading-relaxed">Monitor fraud patterns and trends as they happen with customizable dashboards</p>
                 </div>
               </div>

               <div className="flex items-start space-x-8">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-2">
                   <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-foreground text-2xl mb-3">Predictive Modeling</h3>
                   <p className="text-muted-foreground text-lg leading-relaxed">Anticipate fraud before it happens with ML predictions and risk scoring</p>
                 </div>
               </div>

               <div className="flex items-start space-x-8">
                 <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-2">
                   <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-foreground text-2xl mb-3">Investigation Tools</h3>
                   <p className="text-muted-foreground text-lg leading-relaxed">Deep-dive analysis with network graphs and timeline views for thorough investigations</p>
                 </div>
               </div>
             </div>
           </div>

           <div className="relative">
             <div className="bg-card rounded-3xl shadow-2xl p-10 border border-border">
               <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-semibold">Fraud Analytics Dashboard</h3>
                 <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2">Live</Badge>
               </div>
               
               <div className="grid grid-cols-3 gap-8 mb-10">
                 <div className="text-center p-8 bg-gradient-to-br from-red-50 dark:from-red-950/20 to-red-100 dark:to-red-900/10 rounded-xl">
                   <div className="text-4xl font-bold text-red-600 dark:text-red-400">847</div>
                   <div className="text-sm text-red-600 dark:text-red-400 mt-2">Blocked Today</div>
                 </div>
                 <div className="text-center py-8 bg-gradient-to-br from-blue-50 dark:from-blue-950/20 to-blue-100 dark:to-blue-900/10 rounded-xl">
                   <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">RP.2.3B</div>
                   <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">Protected</div>
                 </div>
                 <div className="text-center p-8 bg-gradient-to-br from-green-50 dark:from-green-950/20 to-green-100 dark:to-green-900/10 rounded-xl">
                   <div className="text-4xl font-bold text-green-600 dark:text-green-400">99.8%</div>
                   <div className="text-sm text-green-600 dark:text-green-400 mt-2">Accuracy</div>
                 </div>
               </div>

               <div className="space-y-8">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium">Detection Rate</span>
                   <span className="text-sm text-muted-foreground">99.8%</span>
                 </div>
                 <div className="w-full bg-muted rounded-full h-4">
                   <div className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full" style={{ width: '99.8%' }}></div>
                 </div>

                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium">Response Time</span>
                   <span className="text-sm text-muted-foreground">&lt; 200ms</span>
                 </div>
                 <div className="w-full bg-muted rounded-full h-4">
                   <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full" style={{ width: '95%' }}></div>
                 </div>

                 <div className="flex items-center justify-between">
                   <span className="text-sm font-medium">False Positives</span>
                   <span className="text-sm text-muted-foreground">0.2%</span>
                 </div>
                 <div className="w-full bg-muted rounded-full h-4">
                   <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-4 rounded-full" style={{ width: '2%' }}></div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Testimonials Section */}
     <section id="testimonials" className="py-10 bg-muted/20">
       <div className="container mx-auto px-8 lg:px-12">
         <div className="text-center mb-24">
           <Badge className="mb-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800 px-6 py-3">
             ⭐ Trusted by Leading Banks
           </Badge>
           <h2 className="text-6xl font-bold mb-8 text-foreground leading-tight">
             What Our Clients Say
           </h2>
           <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
             Join over 50+ Indonesian financial institutions that trust SI JagaDana 
             to protect their customers and assets from sophisticated fraud attempts.
           </p>
         </div>

         <div className="grid lg:grid-cols-3 gap-12">
           <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
             <CardContent className="p-12">
               <div className="flex items-center mb-8">
                 {[...Array(5)].map((_, i) => (
                   <svg key={i} className="w-6 h-6 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                   </svg>
                 ))}
               </div>
               <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                 "SI JagaDana has revolutionized our fraud detection capabilities. The AI-powered system 
                 caught fraudulent transactions that our previous system missed, saving us millions."
               </p>
               <div className="flex items-center">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                   <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">AS</span>
                 </div>
                 <div className="ml-6">
                   <div className="font-semibold text-foreground text-lg">Ahmad Subhan</div>
                   <div className="text-sm text-muted-foreground">Head of Risk Management, Bank Nasional</div>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
             <CardContent className="p-12">
               <div className="flex items-center mb-8">
                 {[...Array(5)].map((_, i) => (
                   <svg key={i} className="w-6 h-6 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                   </svg>
                 ))}
               </div>
               <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                 "The real-time monitoring and investigation tools have significantly reduced our 
                 response time to fraud incidents. Customer satisfaction has improved dramatically."
               </p>
               <div className="flex items-center">
                 <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                   <span className="text-purple-600 dark:text-purple-400 font-semibold text-lg">SP</span>
                 </div>
                 <div className="ml-6">
                   <div className="font-semibold text-foreground text-lg">Sari Permata</div>
                   <div className="text-sm text-muted-foreground">Chief Security Officer, Digital Bank Indonesia</div>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
             <CardContent className="p-12">
               <div className="flex items-center mb-8">
                 {[...Array(5)].map((_, i) => (
                   <svg key={i} className="w-6 h-6 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                   </svg>
                 ))}
               </div>
               <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                 "Implementation was seamless and the support team is exceptional. Our fraud losses 
                 have decreased by 85% since using SI JagaDana. Best investment we've made."
               </p>
               <div className="flex items-center">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                   <span className="text-green-600 dark:text-green-400 font-semibold text-lg">BW</span>
                 </div>
                 <div className="ml-6">
                   <div className="font-semibold text-foreground text-lg">Bambang Wijaya</div>
                   <div className="text-sm text-muted-foreground">IT Director, Koperasi Sejahtera</div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
       </div>
     </section>

     {/* Pricing Section */}
     <section id="pricing" className="py-20 bg-gradient-to-br from-background to-muted/20">
       <div className="container mx-auto px-8 lg:px-12">
         <div className="text-center mb-24">
           <Badge className="mb-8 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 px-6 py-3">
             💰 Flexible Pricing
           </Badge>
           <h2 className="text-6xl font-bold mb-8 text-foreground leading-tight">
             Choose Your Plan
           </h2>
           <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
             Scale with confidence. From startups to enterprise banks, 
             we have a plan that fits your needs and budget perfectly.
           </p>
         </div>

         <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
           {/* Starter Plan */}
           <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
             <CardHeader className="text-center p-12">
               <CardTitle className="text-3xl mb-6">Starter</CardTitle>
               <CardDescription className="text-muted-foreground text-lg">Perfect for small institutions</CardDescription>
               <div className="mt-8">
                 <span className="text-5xl font-bold text-foreground">Rp.99,000</span>
                 <span className="text-muted-foreground text-lg">/month</span>
               </div>
             </CardHeader>
             <CardContent className="space-y-8 px-12 pb-12">
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Up to 10,000 transactions/day</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Real-time fraud detection</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Basic analytics dashboard</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Email support</span>
               </div>
               <Button className="w-full mt-12 py-6 text-lg" variant="outline" onClick={() => router.push('/register')}>
                 Start Free Trial
               </Button>
             </CardContent>
           </Card>

           {/* Professional Plan */}
           <Card className="border-2 border-blue-500 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative">
             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
               <Badge className="bg-blue-500 text-white px-8 py-3 text-sm">Most Popular</Badge>
             </div>
             <CardHeader className="text-center p-12">
               <CardTitle className="text-3xl mb-6">Professional</CardTitle>
               <CardDescription className="text-muted-foreground text-lg">For growing financial institutions</CardDescription>
               <div className="mt-8">
                 <span className="text-5xl font-bold text-foreground">Rp.299,000</span>
                 <span className="text-muted-foreground text-lg">/month</span>
               </div>
             </CardHeader>
             <CardContent className="space-y-8 px-12 pb-12">
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Up to 100,000 transactions/day</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Advanced ML algorithms</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Investigation tools</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">24/7 phone support</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">API access</span>
               </div>
               <Button className="w-full mt-12 py-6 text-lg bg-blue-500 hover:bg-blue-600" onClick={() => router.push('/register')}>
                 Start Free Trial
               </Button>
             </CardContent>
           </Card>

           {/* Enterprise Plan */}
           <Card className="border-2 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
             <CardHeader className="text-center p-12">
               <CardTitle className="text-3xl mb-6">Enterprise</CardTitle>
               <CardDescription className="text-muted-foreground text-lg">For large banks and institutions</CardDescription>
               <div className="mt-8">
                 <span className="text-5xl font-bold text-foreground">Custom</span>
                 <div className="text-muted-foreground text-lg mt-2">Contact for pricing</div>
               </div>
             </CardHeader>
             <CardContent className="space-y-8 px-12 pb-12">
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Unlimited transactions</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Custom ML models</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">White-label solution</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">Dedicated support team</span>
               </div>
               <div className="flex items-center">
                 <svg className="w-6 h-6 text-green-500 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
                 <span className="text-lg">On-premise deployment</span>
               </div>
               <Button className="w-full mt-12 py-6 text-lg" variant="outline" onClick={() => router.push('/contact')}>
                 Contact Sales
               </Button>
             </CardContent>
           </Card>
         </div>
       </div>
     </section>

     {/* CTA Section */}
     <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
       <div className="container mx-auto px-8 lg:px-12 text-center relative">
         <h2 className="text-6xl lg:text-7xl font-bold mb-12 leading-tight">
           Ready to Transform Your
           <br />
           Fraud Detection?
         </h2>
         <p className="text-xl lg:text-2xl text-blue-100 mb-16 max-w-4xl mx-auto leading-relaxed">
           Join over 50+ Indonesian financial institutions that trust SI JagaDana to protect 
           their customers and prevent fraud losses. Start your free trial today.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
           <Button 
             size="lg"
             onClick={() => router.push('/register')}
             className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-16 py-8 shadow-xl"
           >
             Start Free Trial
             <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
             </svg>
           </Button>
           <Button 
             variant="outline" 
             size="lg"
             onClick={() => router.push('/contact')}
             className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 text-xl px-16 py-8"
           >
             Contact Sales
           </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
           <div className="text-center">
            <div className="text-5xl font-bold mb-6">30 Days</div>
             <div className="text-blue-100 text-xl">Free Trial</div>
           </div>
           <div className="text-center">
             <div className="text-5xl font-bold mb-6">24/7</div>
             <div className="text-blue-100 text-xl">Support</div>
           </div>
           <div className="text-center">
             <div className="text-5xl font-bold mb-6">99.8%</div>
             <div className="text-blue-100 text-xl">Detection Rate</div>
           </div>
         </div>
       </div>
     </section>

     {/* Footer */}
     <footer className="bg-background dark:bg-gray-900 border-t border-border py-24">
       <div className="container mx-auto px-8 lg:px-12">
         <div className="grid lg:grid-cols-4 gap-16">
           <div className="col-span-2">
             <div className="flex items-center space-x-6 mb-10">
               <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                 </svg>
               </div>
               <div>
                 <span className="text-3xl font-bold">SI JagaDana</span>
                 <div className="text-muted-foreground text-lg">AI-Powered Fraud Detection</div>
               </div>
             </div>
             <p className="text-muted-foreground mb-10 max-w-md text-lg leading-relaxed">
               Protecting Indonesian financial institutions with next-generation AI technology. 
               Secure, compliant, and built for the future of banking.
             </p>
             <div className="flex space-x-8">
               <a href="#" className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                 </svg>
               </a>
               <a href="#" className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                 </svg>
               </a>
               <a href="#" className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.488-1.995.219 0 .979.219.979 1.219 0 .759-.248 1.896-.377 2.955-.107.662.331 1.219.994 1.219 1.191 0 2.107-1.264 2.107-3.096 0-1.615-1.158-2.747-2.81-2.747-1.913 0-3.04 1.264-3.04 2.578 0 .514.2 1.066.447 1.367.05.058.058.107.041.166-.083.349-.269 1.107-.306 1.264-.041.199-.138.239-.318.144-1.107-.514-1.798-2.133-1.798-3.439 0-2.812 2.042-5.389 5.896-5.389 3.096 0 5.506 2.207 5.506 5.155 0 3.079-1.939 5.554-4.632 5.554-.902 0-1.75-.468-2.042-1.027 0 0-.447 1.696-.553 2.115-.199.759-.736 1.696-1.096 2.273.827.255 1.696.396 2.602.396 6.621 0 11.99-5.367 11.99-11.987C24.007 5.367 18.639.001 12.017.001z"/>
                 </svg>
               </a>
             </div>
           </div>
           
           <div>
             <h3 className="text-xl font-semibold mb-8">Product</h3>
             <ul className="space-y-6">
               <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Features</a></li>
               <li><a href="#security" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Security</a></li>
               <li><a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Analytics</a></li>
               <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Pricing</a></li>
               <li><a href="/demo" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Demo</a></li>
             </ul>
           </div>

           <div>
             <h3 className="text-xl font-semibold mb-8">Company</h3>
             <ul className="space-y-6">
               <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-lg">About Us</a></li>
               <li><a href="/careers" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Careers</a></li>
               <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Contact</a></li>
               <li><a href="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Blog</a></li>
               <li><a href="/press" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Press</a></li>
             </ul>
           </div>
         </div>

         <div className="border-t border-border mt-20 pt-12">
           <div className="flex flex-col md:flex-row justify-between items-center">
             <div className="text-muted-foreground text-lg mb-8 md:mb-0">
               © 2025 SI JagaDana. All rights reserved. Built for Indonesian Financial Security.
             </div>
             <div className="flex space-x-10 text-lg">
               <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
               <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
               <a href="/compliance" className="text-muted-foreground hover:text-foreground transition-colors">Compliance</a>
             </div>
           </div>
         </div>
       </div>
     </footer>
   </div>
 );
}