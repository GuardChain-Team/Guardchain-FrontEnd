"use client";
import Image from 'next/image';
import logoImage from '@/assets/images/icons/logo.png';
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

export default function CareersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jobOpenings = [
    {
      title: "Senior Machine Learning Engineer",
      department: "Engineering",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Senior",
      description: "Lead the development of advanced ML algorithms for fraud detection. Work with large-scale data processing and real-time inference systems.",
      requirements: [
        "5+ years experience in machine learning",
        "Strong background in Python, TensorFlow/PyTorch",
        "Experience with fraud detection or anomaly detection",
        "Knowledge of distributed systems and real-time processing"
      ],
      benefits: ["Competitive salary", "Health insurance", "Stock options", "Remote work flexibility"]
    },
    {
      title: "Frontend Developer (React/Next.js)",
      department: "Engineering",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Mid-Senior",
      description: "Build beautiful and intuitive user interfaces for our fraud detection platform. Work closely with designers and backend engineers.",
      requirements: [
        "3+ years experience with React and Next.js",
        "Strong TypeScript and modern CSS skills",
        "Experience with component libraries (shadcn/ui preferred)",
        "Understanding of responsive design and accessibility"
      ],
      benefits: ["Competitive salary", "Health insurance", "Learning budget", "Flexible hours"]
    },
    {
      title: "Data Scientist - Fraud Analytics",
      department: "Data Science",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Mid-Senior",
      description: "Analyze fraud patterns and develop predictive models. Work with behavioral analytics and risk scoring algorithms.",
      requirements: [
        "Master's degree in Statistics, Mathematics, or related field",
        "3+ years experience in data science",
        "Strong SQL and Python skills",
        "Experience with financial data and fraud detection"
      ],
      benefits: ["Competitive salary", "Health insurance", "Conference attendance", "Research time"]
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Senior",
      description: "Build and maintain our cloud infrastructure. Ensure high availability and security of our fraud detection systems.",
      requirements: [
        "4+ years experience with AWS/GCP",
        "Strong knowledge of Kubernetes and Docker",
        "Experience with CI/CD pipelines",
        "Security best practices knowledge"
      ],
      benefits: ["Competitive salary", "Health insurance", "Stock options", "Certification budget"]
    },
    {
      title: "Product Manager - Security",
      department: "Product",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Senior",
      description: "Drive product strategy for security features. Work with engineering teams to deliver innovative fraud prevention solutions.",
      requirements: [
        "5+ years product management experience",
        "Background in cybersecurity or fintech",
        "Strong analytical and communication skills",
        "Experience with B2B products"
      ],
      benefits: ["Competitive salary", "Health insurance", "Stock options", "Product conference access"]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Mid-Senior",
      description: "Ensure client success and satisfaction. Help financial institutions implement and optimize our fraud detection solutions.",
      requirements: [
        "3+ years in customer success or account management",
        "Experience in financial services or fintech",
        "Strong communication and problem-solving skills",
        "Bahasa Indonesia and English fluency"
      ],
      benefits: ["Competitive salary", "Health insurance", "Travel opportunities", "Performance bonuses"]
    },
    {
      title: "Security Engineer",
      department: "Security",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Senior",
      description: "Implement security measures and conduct security assessments. Ensure compliance with banking regulations and data protection laws.",
      requirements: [
        "4+ years in cybersecurity",
        "Experience with security frameworks and compliance",
        "Knowledge of banking regulations (BI, OJK)",
        "Security certifications preferred (CISSP, CISM)"
      ],
      benefits: ["Competitive salary", "Health insurance", "Certification support", "Security conference attendance"]
    },
    {
      title: "Business Development Representative",
      department: "Sales",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Entry-Mid",
      description: "Generate new business opportunities and build relationships with potential banking clients. Support the sales team in achieving revenue targets.",
      requirements: [
        "2+ years in B2B sales or business development",
        "Experience in financial services preferred",
        "Strong networking and communication skills",
        "Goal-oriented and self-motivated"
      ],
      benefits: ["Base salary + commission", "Health insurance", "Sales incentives", "Career growth opportunities"]
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      level: "Mid-Senior",
      description: "Design intuitive interfaces for complex fraud detection workflows. Create user-centered designs that make sophisticated technology accessible.",
      requirements: [
        "3+ years experience in UX/UI design",
        "Proficiency in Figma and design systems",
        "Experience with complex B2B applications",
        "Understanding of accessibility standards"
      ],
      benefits: ["Competitive salary", "Health insurance", "Design tools budget", "Creative freedom"]
    }
  ];

  const departments = ["All", "Engineering", "Data Science", "Product", "Customer Success", "Security", "Sales", "Design"];

  const filteredJobs = selectedDepartment === "All" 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === selectedDepartment);

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Compensation",
      description: "Market-leading salaries plus equity participation in our growth story."
    },
    {
      icon: "🏥",
      title: "Comprehensive Health Coverage",
      description: "Full medical, dental, and vision insurance for you and your family."
    },
    {
      icon: "🌴",
      title: "Flexible Time Off",
      description: "Unlimited PTO policy with encouraged minimum vacation days."
    },
    {
      icon: "🎓",
      title: "Learning & Development",
      description: "Annual learning budget, conference attendance, and skill development programs."
    },
    {
      icon: "🏠",
      title: "Remote Work Options",
      description: "Flexible hybrid work arrangements with home office equipment provided."
    },
    {
      icon: "🚀",
      title: "Stock Options",
      description: "Equity participation for all employees to share in our success."
    },
    {
      icon: "👶",
      title: "Family Support",
      description: "Generous parental leave and family-friendly policies."
    },
    {
      icon: "🏃‍♂️",
      title: "Wellness Programs",
      description: "Gym memberships, mental health support, and wellness initiatives."
    }
  ];

  const companyPerks = [
    {
      title: "Innovation Time",
      description: "20% time for personal projects and innovation",
      icon: "💡"
    },
    {
      title: "Latest Tech Stack",
      description: "Work with cutting-edge AI and cloud technologies",
      icon: "⚡"
    },
    {
      title: "Impact-Driven Work",
      description: "Protect millions of transactions daily",
      icon: "🛡️"
    },
    {
      title: "Diverse Team",
      description: "Collaborative, inclusive, and global mindset",
      icon: "🌍"
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
      <Image 
        src={logoImage} 
        alt="SI JagaDana Logo" 
        width={40} 
        height={40} 
        className="rounded-lg"
      />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
              <div>
                <span 
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent cursor-pointer"
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
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50"
              >
                About
              </a>
              <a
                href="/#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50"
              >
                Pricing
              </a>
              <span className="text-foreground font-medium px-3 py-2 rounded-md bg-muted/50">
                Careers
              </span>
            </nav>

            <div className="flex items-center space-x-6">
              <ThemeSwitcher />
              {session ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3"
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
                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8 py-3"
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
      <section className="relative py-32 lg:py-8 overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-8 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 px-6 py-3">
              🚀 Join Our Mission
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="text-foreground">Build the Future of</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-400 bg-clip-text text-transparent">
                Financial Security
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-16">
              Join our team of passionate technologists and security experts as we revolutionize fraud detection 
              across Indonesia. Make a real impact protecting millions of transactions every day.
            </p>

            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {companyPerks.map((perk, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{perk.icon}</div>
                  <div className="font-semibold text-foreground mb-2">{perk.title}</div>
                  <div className="text-sm text-muted-foreground">{perk.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 px-6 py-3">
              💼 Why SI JagaDana?
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-foreground">More Than Just a</span>
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"> Job</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              At SI JagaDana, you'll work with cutting-edge technology while making a meaningful impact on Indonesia's financial security landscape.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-32">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 px-6 py-3">
              💻 Open Positions
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-foreground">Current</span>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> Opportunities</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
              We're always looking for talented individuals to join our growing team. Find your perfect role below.
            </p>

            {/* Department Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  onClick={() => setSelectedDepartment(dept)}
                  className={selectedDepartment === dept 
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-purple-700" 
                    : ""
                  }
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-8">
            {filteredJobs.map((job, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-foreground">{job.title}</h3>
                        <Badge variant="secondary">{job.level}</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-purple-700 mt-6 lg:mt-0"
                      onClick={() => {
                        // In a real app, this would open an application form or redirect to a job board
                        alert(`Apply for ${job.title}. In a real application, this would open the application form.`);
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>

                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{job.description}</p>

                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-4">Requirements:</h4>
                      <ul className="space-y-3">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-4">Benefits:</h4>
                      <ul className="space-y-3">
                        {job.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-32 bg-gradient-to-r from-blue-900 via-blue-400 to-blue-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12 relative">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3">
              🎯 Our Culture
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              Life at SI JagaDana
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              We foster a culture of innovation, collaboration, and continuous learning where every team member can thrive and make an impact.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6">Innovation First</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                We encourage experimentation and provide time for personal projects that push the boundaries of what's possible.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6">Collaborative Spirit</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Cross-functional teams work together seamlessly, sharing knowledge and supporting each other's growth.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6">Continuous Learning</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Regular training, conference attendance, and mentorship programs keep our team at the forefront of technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-8 lg:px-12 text-center">
          <h2 className="text-6xl lg:text-7xl font-bold mb-12 leading-tight">
            <span className="text-foreground">Ready to Make an</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              Impact?
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
            Don't see the perfect role yet? We're always interested in connecting with talented individuals 
            who share our passion for financial security and innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <Button
             size="lg"
             onClick={() => {
               // In a real app, this would open a general application form
               alert("General application form would open here.");
             }}
             className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-xl px-16 py-8 shadow-xl"
           >
             Send Us Your Resume
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
             onClick={() => router.push("/contact")}
             className="border-2 text-xl px-16 py-8"
           >
             Contact HR Team
           </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
           <div className="text-center">
             <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-6">Remote OK</div>
             <div className="text-muted-foreground text-xl">Flexible Work Arrangements</div>
           </div>
           <div className="text-center">
             <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">Fast Growth</div>
             <div className="text-muted-foreground text-xl">Rapid Career Development</div>
           </div>
           <div className="text-center">
             <div className="text-5xl font-bold text-blue-400 dark:text-purple-400 mb-6">Global Impact</div>
             <div className="text-muted-foreground text-xl">Protect Millions Daily</div>
           </div>
         </div>
       </div>
     </section>

     {/* Application Process Section */}
     <section className="py-32 bg-muted/20">
       <div className="container mx-auto px-8 lg:px-12">
         <div className="text-center mb-20">
           <Badge className="mb-8 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800 px-6 py-3">
             📋 Application Process
           </Badge>
           <h2 className="text-6xl font-bold mb-8 leading-tight">
             <span className="text-foreground">How to</span>
             <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Join Us</span>
           </h2>
           <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
             Our hiring process is designed to be fair, transparent, and respectful of your time while ensuring the best fit for both parties.
           </p>
         </div>

         <div className="grid lg:grid-cols-4 gap-8">
           <Card className="border-0 shadow-lg text-center">
             <CardContent className="p-10">
               <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-8">
                 <span className="text-white font-bold text-2xl">1</span>
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-6">Apply Online</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Submit your application through our career portal. We review every application carefully.
               </p>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-lg text-center">
             <CardContent className="p-10">
               <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8">
                 <span className="text-white font-bold text-2xl">2</span>
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-6">Initial Screening</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Phone or video call with our HR team to discuss your background and interest in the role.
               </p>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-lg text-center">
             <CardContent className="p-10">
               <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8">
                 <span className="text-white font-bold text-2xl">3</span>
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-6">Technical Interview</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Deep dive into your technical skills with the team you'll be working with directly.
               </p>
             </CardContent>
           </Card>

           <Card className="border-0 shadow-lg text-center">
             <CardContent className="p-10">
               <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-8">
                 <span className="text-white font-bold text-2xl">4</span>
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-6">Final Interview</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Meet with leadership to discuss culture fit, career goals, and answer any final questions.
               </p>
             </CardContent>
           </Card>
         </div>

         <div className="text-center mt-16">
           <p className="text-lg text-muted-foreground mb-8">
             <strong>Timeline:</strong> Our entire process typically takes 2-3 weeks from application to offer.
           </p>
           <p className="text-lg text-muted-foreground">
             <strong>Questions?</strong> Reach out to our HR team at{" "}
             <a href="mailto:careers@sijagadana.com" className="text-blue-600 dark:text-blue-400 hover:underline">
               careers@sijagadana.com
             </a>
           </p>
         </div>
       </div>
     </section>

     {/* Footer */}
     <footer className="bg-background dark:bg-gray-900 border-t border-border py-24">
       <div className="container mx-auto px-8 lg:px-12">
         <div className="grid lg:grid-cols-4 gap-16">
           <div className="col-span-2">
             <div className="flex items-center space-x-6 mb-10">
                <div className="relative">
      <Image 
        src={logoImage} 
        alt="SI JagaDana Logo" 
        width={40} 
        height={40} 
        className="rounded-lg"
      />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
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
             <div className="flex space-x-8">
               <a
                 href="#"
                 className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
               >
                 <svg
                   className="w-6 h-6"
                   fill="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                 </svg>
               </a>
               <a
                 href="#"
                 className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
               >
                 <svg
                   className="w-6 h-6"
                   fill="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                 </svg>
               </a>
             </div>
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
                 <a
                   href="/about"
                   className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                 >
                   About Us
                 </a>
               </li>
               <li>
                 <span className="text-foreground text-lg font-medium">
                   Careers
                 </span>
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