"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

export default function AboutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const teamMembers = [
    {
      name: "Dr. Ahmad Rizki",
      role: "CEO & Founder",
      image: "AR",
      description: "Former VP of Engineering at Bank Central Asia with 15+ years experience in financial technology and AI.",
      expertise: ["Financial Technology", "AI Strategy", "Banking Systems"]
    },
    {
      name: "Sarah Putri",
      role: "CTO & Co-Founder", 
      image: "SP",
      description: "Ex-Senior ML Engineer at Gojek, specialized in fraud detection algorithms and real-time systems.",
      expertise: ["Machine Learning", "Fraud Detection", "System Architecture"]
    },
    {
      name: "Bambang Setiawan",
      role: "Head of Product",
      image: "BS", 
      description: "Former Product Lead at OVO with deep understanding of Indonesian payment systems and user behavior.",
      expertise: ["Product Strategy", "Payment Systems", "User Experience"]
    },
    {
      name: "Lisa Maharani",
      role: "Head of Security",
      image: "LM",
      description: "Cybersecurity expert with experience at Bank Indonesia, ensuring compliance and data protection.",
      expertise: ["Cybersecurity", "Compliance", "Risk Management"]
    },
    {
      name: "Dito Pratama",
      role: "Lead Data Scientist",
      image: "DP",
      description: "PhD in Computer Science, specialist in anomaly detection and behavioral analytics for financial fraud.",
      expertise: ["Data Science", "Anomaly Detection", "Behavioral Analytics"]
    },
    {
      name: "Maya Sari",
      role: "Head of Customer Success",
      image: "MS",
      description: "Former relationship manager at Bank Mandiri, focused on client success and implementation support.",
      expertise: ["Customer Success", "Implementation", "Banking Relations"]
    }
  ];

  const milestones = [
    { year: "2020", title: "Company Founded", description: "Started with a vision to revolutionize fraud detection in Indonesia" },
    { year: "2021", title: "First Client", description: "Successfully deployed at a regional bank with 99.5% accuracy rate" },
    { year: "2022", title: "Series A Funding", description: "Raised $5M to accelerate product development and team expansion" },
    { year: "2023", title: "Bank Indonesia Certification", description: "Achieved full compliance with Indonesian banking regulations" },
    { year: "2024", title: "50+ Clients", description: "Expanded to serve over 50 financial institutions across Indonesia" },
    { year: "2025", title: "AI Innovation Award", description: "Recognized as Indonesia's leading fintech security solution" }
  ];

  const values = [
    {
      icon: "🛡️",
      title: "Security First",
      description: "We prioritize the highest levels of security and data protection in everything we build."
    },
    {
      icon: "🇮🇩", 
      title: "Built for Indonesia",
      description: "Our solutions are specifically designed for Indonesian banking systems and regulations."
    },
    {
      icon: "🚀",
      title: "Innovation",
      description: "We continuously push the boundaries of AI and machine learning in fraud detection."
    },
    {
      icon: "🤝",
      title: "Partnership",
      description: "We work closely with our clients as trusted partners in their security journey."
    },
    {
      icon: "🎯",
      title: "Excellence",
      description: "We strive for perfection in our technology and service delivery."
    },
    {
      icon: "💡",
      title: "Transparency",
      description: "We believe in open communication and transparency with all our stakeholders."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 dark:bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300/20 dark:bg-green-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-8 lg:px-12 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  SI JagaDana
                </span>
                <div className="text-xs text-muted-foreground">
                  AI-Powered Security
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-12">
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50"
              >
                Home
              </a>
              <a
                href="/#features"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50"
              >
                Features
              </a>
              <a
                href="/#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50"
              >
                Pricing
              </a>
              <span className="text-foreground font-medium px-3 py-2 rounded-md bg-muted/50">
                About
              </span>
            </nav>

            <div className="flex items-center space-x-6">
              <ThemeSwitcher />
              {session ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/login")}
                    className="hover:bg-muted px-8 py-3"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push("/register")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-8 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 px-6 py-3">
              🏢 About SI JagaDana
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="text-foreground">Protecting Indonesia's</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-16">
              We are a team of passionate technologists and financial experts dedicated to revolutionizing fraud detection 
              in Indonesia through cutting-edge artificial intelligence and machine learning technologies.
            </p>

            <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">50+</div>
                <div className="text-lg text-muted-foreground">Financial Institutions Protected</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">Rp.2.3T</div>
                <div className="text-lg text-muted-foreground">Protected Daily</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">99.8%</div>
                <div className="text-lg text-muted-foreground">Detection Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 px-6 py-3">
                🎯 Our Mission
              </Badge>
              <h2 className="text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Empowering Secure
                </span>
                <br />
                <span className="text-foreground">Digital Banking</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our mission is to create a safer digital banking environment for all Indonesians by providing 
                world-class fraud detection technology that adapts to emerging threats while maintaining the 
                highest standards of privacy and compliance.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-2">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xl mb-2">Advanced AI Protection</h3>
                    <p className="text-muted-foreground">Cutting-edge machine learning algorithms that evolve with fraud patterns</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-2">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xl mb-2">Indonesian Focus</h3>
                    <p className="text-muted-foreground">Built specifically for Indonesian banking regulations and fraud patterns</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-3xl shadow-2xl border border-border p-10">
                <div className="space-y-8">
                  <div className="text-center">
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 mb-6">
                      🔮 Our Vision
                    </Badge>
                    <h3 className="text-3xl font-bold mb-6">A Fraud-Free Indonesia</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      We envision an Indonesia where every digital transaction is secure, where financial institutions 
                      can innovate without security concerns, and where customers can bank with complete confidence.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 dark:from-blue-950/20 to-blue-100 dark:to-blue-900/10 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2030</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">Target: Zero Fraud</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 dark:from-green-950/20 to-green-100 dark:to-green-900/10 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-2">Coverage Goal</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full opacity-20 animate-ping"></div>
              <div
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/20 rounded-full opacity-20 animate-ping"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 px-6 py-3">
              💎 Our Values
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-foreground">What Drives</span>
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Us</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Our core values guide every decision we make and every solution we build for our clients.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/10">
                <CardContent className="p-10 text-center">
                  <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12 relative">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3">
              📈 Our Journey
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              Building the Future of Fraud Detection
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              From a small startup to Indonesia's leading fraud detection platform, here's our journey of innovation and growth.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-white/20"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="text-4xl font-bold mb-4">{milestone.year}</div>
                    <h3 className="text-2xl font-semibold mb-4">{milestone.title}</h3>
                    <p className="text-blue-100 text-lg leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full border-4 border-blue-600"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800 px-6 py-3">
              👥 Meet Our Team
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-foreground">The Minds Behind</span>
              <br />
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                SI JagaDana
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Our diverse team combines deep expertise in artificial intelligence, cybersecurity, and Indonesian financial systems.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-10 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">{member.image}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">{member.name}</h3>
                  <div className="text-lg text-muted-foreground mb-6">{member.role}</div>
                  <p className="text-muted-foreground leading-relaxed mb-8">{member.description}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12 text-center relative">
          <h2 className="text-6xl lg:text-7xl font-bold mb-12 leading-tight">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl lg:text-2xl text-blue-100 mb-16 max-w-4xl mx-auto leading-relaxed">
            Whether you're a financial institution looking for better fraud protection or a talented individual 
            wanting to make a difference, we'd love to hear from you.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-16 py-8 shadow-xl"
            >
              Start Your Journey
              <svg
                className="ml-3 w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/careers")}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-xl px-16 py-8"
            >
              Join Our Team
            </Button>
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
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-3xl font-bold">SI JagaDana</span>
                  <div className="text-muted-foreground text-lg">
                    AI-Powered Fraud Detection
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-10 max-w-md text-lg leading-relaxed">
                Protecting Indonesian financial institutions with next-generation AI technology. 
                Secure, compliant, and built for the future of banking.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-8">Product</h3>
              <ul className="space-y-6">
                <li>
                  <a
                    href="/#features"
                    className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/#security"
                    className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="/#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-8">Company</h3>
              <ul className="space-y-6">
                <li>
                  <span className="text-foreground text-lg font-medium">
                    About Us
                  </span>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-20 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-muted-foreground text-lg mb-8 md:mb-0">
               © 2025 SI JagaDana. All rights reserved. Built for Indonesian Financial Security.
             </div>
             <div className="flex space-x-10 text-lg">
               <a
                 href="/privacy"
                 className="text-muted-foreground hover:text-foreground transition-colors"
               >
                 Privacy Policy
               </a>
               <a
                 href="/terms"
                 className="text-muted-foreground hover:text-foreground transition-colors"
               >
                 Terms of Service
               </a>
               <a
                 href="/compliance"
                 className="text-muted-foreground hover:text-foreground transition-colors"
               >
                 Compliance
               </a>
             </div>
           </div>
         </div>
       </div>
     </footer>
   </div>
 );
}