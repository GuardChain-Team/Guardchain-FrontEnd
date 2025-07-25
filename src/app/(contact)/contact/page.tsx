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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: ""
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to your backend
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: ""
    });
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Get in touch via email",
      details: "hello@sijagadana.com",
      subDetails: "We respond within 24 hours"
    },
    {
      icon: "📞",
      title: "Call Us",
      description: "Speak with our team directly",
      details: "+62 21 2922 1234",
      subDetails: "Mon-Fri, 9:00 AM - 6:00 PM WIB"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Chat with our support team",
      details: "Available on our website",
      subDetails: "Mon-Fri, 9:00 AM - 6:00 PM WIB"
    },
    {
      icon: "🏢",
      title: "Visit Our Office",
      description: "Meet us in person",
      details: "Menara BCA, 46th Floor",
      subDetails: "Jl. MH Thamrin No.1, Jakarta Pusat"
    }
  ];

  const offices = [
    {
      city: "Jakarta",
      address: "Menara BCA, 46th Floor\nJl. MH Thamrin No.1\nJakarta Pusat 10310",
      phone: "+62 21 2922 1234",
      email: "jakarta@sijagadana.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM WIB"
    },
    {
      city: "Surabaya",
      address: "Pakuwon Tower, 20th Floor\nJl. Embong Malang No.1-5\nSurabaya 60261",
      phone: "+62 31 5633 5678",
      email: "surabaya@sijagadana.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM WIB"
    },
    {
      city: "Bandung",
      address: "Gedung Asia Afrika, 15th Floor\nJl. Asia Afrika No.133-137\nBandung 40112",
      phone: "+62 22 4233 9876",
      email: "bandung@sijagadana.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM WIB"
    }
  ];

  const faqs = [
    {
      question: "How quickly can SI JagaDana be implemented?",
      answer: "Implementation typically takes 2-4 weeks depending on your existing systems and requirements. Our team provides full support throughout the process."
    },
    {
      question: "Is SI JagaDana compliant with Indonesian banking regulations?",
      answer: "Yes, we are fully compliant with Bank Indonesia regulations, OJK requirements, and all relevant Indonesian banking laws and data protection standards."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer 24/7 technical support, dedicated customer success managers, regular training sessions, and ongoing system optimization."
    },
    {
      question: "Can SI JagaDana integrate with our existing banking systems?",
      answer: "Absolutely. Our platform is designed with APIs and integration capabilities for major banking systems used in Indonesia, including core banking platforms and payment processors."
    },
    {
      question: "What's the pricing model?",
      answer: "We offer flexible pricing based on transaction volume and features needed. Contact our sales team for a customized quote based on your specific requirements."
    },
    {
      question: "Do you provide training for our staff?",
      answer: "Yes, we provide comprehensive training programs for your team, including technical training for IT staff and user training for fraud analysts and investigators."
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
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
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
                href="/careers"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium px-3 py-2 rounded-md hover:bg-muted/50"
              >
                Careers
              </a>
              <span className="text-foreground font-medium px-3 py-2 rounded-md bg-muted/50">
                Contact
              </span>
            </nav>

            <div className="flex items-center space-x-6">
              <ThemeSwitcher />
              {session ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-lg px-8 py-3"
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
                    className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 shadow-lg px-8 py-3"
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
            <Badge className="mb-8 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 px-6 py-3">
              📞 Get In Touch
            </Badge>
            
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="text-foreground">Let's Secure Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-800 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-16">
              Ready to protect your institution with AI-powered fraud detection? Our team of experts is here to help 
              you implement the most advanced security solution for Indonesian banking.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">&lt;24h</div>
                <div className="text-lg text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">50+</div>
                <div className="text-lg text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">24/7</div>
                <div className="text-lg text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800 px-6 py-3">
              🔗 Multiple Ways to Connect
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-foreground">Choose Your Preferred</span>
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Contact Method</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Whether you prefer email, phone, or face-to-face meetings, we're here to assist you with all your fraud detection needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-10">
                  <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{method.title}</h3>
                  <p className="text-muted-foreground mb-6">{method.description}</p>
                  <div className="font-semibold text-lg text-foreground mb-2">{method.details}</div>
                  <div className="text-sm text-muted-foreground">{method.subDetails}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-32">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-8">
              <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800 px-6 py-3">
                ✉️ Send Us a Message
              </Badge>
              <h2 className="text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Tell Us About
                </span>
                <br />
                <span className="text-foreground">Your Needs</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours. We'll discuss your specific 
                requirements and how SI JagaDana can help protect your institution.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-2">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xl mb-2">Free Consultation</h3>
                    <p className="text-muted-foreground">Get expert advice tailored to your specific fraud prevention needs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-2">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xl mb-2">Custom Demo</h3>
                    <p className="text-muted-foreground">See SI JagaDana in action with your own data and use cases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-2">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-xl mb-2">Implementation Planning</h3>
                    <p className="text-muted-foreground">Detailed roadmap for seamless integration with your systems</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-2xl">
              <CardContent className="p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Enter your company name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+62 xxx xxx xxxx"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Inquiry Type *
                    </label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) => handleInputChange("inquiryType", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Inquiry</SelectItem>
                        <SelectItem value="demo">Request Demo</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="general">General Information</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us more about your requirements, current challenges, or how we can help..."
                      required
                      className="w-full min-h-[120px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
                  >
                    Send Message
                    <svg
                      className="ml-3 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="py-32 bg-gradient-to-r from-blue-900 via-blue-400 to-blue-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-8 lg:px-12 relative">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-white/20 text-white border-white/30 px-6 py-3">
              🏢 Our Offices
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              Visit Us Across Indonesia
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              With offices in major Indonesian cities, we're always close by to provide personal support and consultation.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {offices.map((office, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <CardContent className="p-10">
                  <h3 className="text-3xl font-bold mb-8">{office.city}</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <svg className="w-6 h-6 text-blue-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-medium mb-2">Address</div>
                        <div className="text-blue-100 whitespace-pre-line">{office.address}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <svg className="w-6 h-6 text-blue-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <div className="font-medium mb-2">Phone</div>
                        <div className="text-blue-100">{office.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <svg className="w-6 h-6 text-blue-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-medium mb-2">Email</div>
                        <div className="text-blue-100">{office.email}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <svg className="w-6 h-6 text-blue-300 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="font-medium mb-2">Office Hours</div>
                        <div className="text-blue-100">{office.hours}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-20">
            <Badge className="mb-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800 px-6 py-3">
              ❓ Frequently Asked Questions
            </Badge>
            <h2 className="text-6xl font-bold mb-8 leading-tight">
              <span className="text-foreground">Common</span>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Find quick answers to the most common questions about SI JagaDana and our fraud detection solutions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
               <CardContent className="p-8">
                 <h3 className="text-xl font-bold text-foreground mb-4">{faq.question}</h3>
                 <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
               </CardContent>
             </Card>
           ))}
         </div>

         <div className="text-center mt-12">
           <p className="text-lg text-muted-foreground mb-6">
             Have more questions? We're here to help!
           </p>
           <Button
             onClick={() => {
               // Scroll to contact form
               document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
             }}
             className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
           >
             Ask a Question
           </Button>
         </div>
       </div>
     </section>

     {/* CTA Section */}
     <section className="py-32 bg-gradient-to-r from-blue-800 via-blue-400 to-blue-900 text-white relative overflow-hidden">
       <div className="container mx-auto px-8 lg:px-12 text-center relative">
         <h2 className="text-6xl lg:text-7xl font-bold mb-12 leading-tight">
           Ready to Get Started?
         </h2>
         <p className="text-xl lg:text-2xl text-blue-100 mb-16 max-w-4xl mx-auto leading-relaxed">
           Join 50+ Indonesian financial institutions that trust SI JagaDana to protect their customers 
           and prevent fraud losses. Let's discuss how we can secure your future.
         </p>

         <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
           <Button
             size="lg"
             onClick={() => router.push("/register")}
             className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-16 py-8 shadow-xl"
           >
             Start Free Trial
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
             onClick={() => {
               // Scroll to contact form
               document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
             }}
             className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-600 text-xl px-16 py-8"
           >
             Schedule Demo
           </Button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
           <div className="text-center">
             <div className="text-5xl font-bold mb-6">Free</div>
             <div className="text-blue-100 text-xl">Consultation & Demo</div>
           </div>
           <div className="text-center">
             <div className="text-5xl font-bold mb-6">2-4 Weeks</div>
             <div className="text-blue-100 text-xl">Implementation Time</div>
           </div>
           <div className="text-center">
             <div className="text-5xl font-bold mb-6">24/7</div>
             <div className="text-blue-100 text-xl">Ongoing Support</div>
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
               <a
                 href="#"
                 className="w-14 h-14 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
               >
                 <svg
                   className="w-6 h-6"
                   fill="currentColor"
                   viewBox="0 0 24 24"
                 >
                   <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
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
               <li>
                 <a
                   href="/demo"
                   className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                 >
                   Demo
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
                 <a
                   href="/careers"
                   className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                 >
                   Careers
                 </a>
               </li>
               <li>
                 <span className="text-foreground text-lg font-medium">
                   Contact
                 </span>
               </li>
               {/* <li>
                 <a
                   href="/blog"
                   className="text-muted-foreground hover:text-foreground transition-colors text-lg"
                 >
                   Blog
                 </a>
               </li> */}
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