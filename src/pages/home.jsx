import { useState, useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import { Zap, Shield, Clock, Award, ArrowRight, Star, MapPin, Phone, Mail, Plug, Lightbulb, CircuitBoard, Cable } from "lucide-react";
import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";
import Login from "./login";
import Register from "./register";

// Modern Hero Section Component
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Power Your Future",
      subtitle: "Premium Electrical Solutions Since 2010",
      description: "Discover cutting-edge electrical products and professional installation services",
      bgGradient: "from-gray-800 via-blue-900 to-gray-900"
    },
    {
      title: "Smart Home Revolution",
      subtitle: "Intelligent Electrical Systems",
      description: "Transform your space with IoT-enabled switches, smart lighting, and automation",
      bgGradient: "from-blue-950 via-gray-800 to-blue-900"
    },
    {
      title: "Industrial Excellence",
      subtitle: "Heavy-Duty Electrical Components",
      description: "Professional-grade equipment for commercial and industrial applications",
      bgGradient: "from-gray-900 via-blue-950 to-gray-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <div className={`relative w-full h-[60vh] sm:h-[70vh] bg-gradient-to-br ${currentHero.bgGradient} overflow-hidden transition-all duration-1000`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6">
        <div className="text-center max-w-4xl">
          <div 
            key={`badge-${currentSlide}`}
            className="inline-flex items-center px-3 py-2 sm:px-4 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-slide-down"
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Trusted by 10,000+ Customers
          </div>
          
          <h1 
            key={`title-${currentSlide}`}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 animate-slide-up leading-tight px-2"
          >
            {currentHero.title}
          </h1>
          
          <p 
            key={`subtitle-${currentSlide}`}
            className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-3 sm:mb-4 font-light animate-slide-left px-2"
          >
            {currentHero.subtitle}
          </p>
          
          <p 
            key={`description-${currentSlide}`}
            className="text-base sm:text-lg text-blue-200 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-right px-4"
          >
            {currentHero.description}
          </p>

          <div 
            key={`buttons-${currentSlide}`}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-4"
          >
            <button className="group bg-white text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base">
              Explore Products
              <ArrowRight className="inline ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
              Get Quote
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Safety Certified",
      description: "All products meet international safety standards with comprehensive warranties",
      color: "from-blue-800 to-blue-900"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical support and emergency electrical services",
      color: "from-gray-700 to-gray-800"
    },
    {
      icon: Award,
      title: "Expert Installation",
      description: "Certified electricians with 25+ years of combined experience",
      color: "from-blue-700 to-blue-800"
    },
    {
      icon: Zap,
      title: "Smart Solutions",
      description: "Cutting-edge IoT and automation systems for modern homes and offices",
      color: "from-gray-800 to-gray-900"
    }
  ];

    return (
      <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
              Why Choose R.S. Electricals?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              We combine decades of expertise with cutting-edge technology to deliver exceptional electrical solutions
            </p>
          </div>        
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{feature.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Product Categories Section
function ProductCategories() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  const categories = [
    {
      title: "Smart Switches & Sockets",
      icon: Plug,
      description: "WiFi-enabled switches, smart sockets, and home automation controls",
      products: "150+ Products",
      bg: "from-gray-800 to-blue-900"
    },
    {
      title: "LED Lighting Solutions",
      icon: Lightbulb,
      description: "Energy-efficient LED bulbs, strips, and professional lighting systems",
      products: "200+ Products",
      bg: "from-blue-900 to-gray-800"
    },
    {
      title: "Electrical Panels & MCBs",
      icon: CircuitBoard,
      description: "Distribution boards, circuit breakers, and safety equipment",
      products: "80+ Products",
      bg: "from-blue-950 to-gray-700"
    },
    {
      title: "Cables & Wiring",
      icon: Cable,
      description: "High-quality copper cables, conduits, and wiring accessories",
      products: "120+ Products",
      bg: "from-gray-700 to-blue-800"
    }
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            Our Product Range
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 px-4">
            Comprehensive electrical solutions for every need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl h-64 sm:h-72 lg:h-80 bg-gradient-to-br ${category.bg} transform transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
              
              <div className="relative z-10 p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{category.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed">{category.description}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs sm:text-sm font-semibold bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-3 rounded-full">
                    {category.products}
                  </span>
                  <ArrowRight 
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
                      hoveredCategory === index ? 'translate-x-2' : ''
                    }`} 
                  />
                </div>
              </div>

              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Homeowner",
      rating: 5,
      text: "R.S. Electricals transformed our home with smart switches and LED lighting. Professional service and excellent quality products!",
      avatar: "PS"
    },
    {
      name: "Rajesh Kumar",
      role: "Business Owner",
      rating: 5,
      text: "Their industrial electrical solutions helped us reduce energy costs by 40%. Highly recommend their expertise!",
      avatar: "RK"
    },
    {
      name: "Anita Patel",
      role: "Architect",
      rating: 5,
      text: "Reliable partner for all our commercial projects. Quality products and timely delivery every time.",
      avatar: "AP"
    }
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Join thousands of satisfied customers across the region
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Contact CTA Section
function ContactCTA() {
  return (
    <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-800 via-blue-900 to-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
          Ready to Power Up Your Space?
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Get expert consultation and premium electrical solutions tailored to your needs
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
          <button className="bg-white text-blue-800 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
            <Phone className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Call Now: +94 77 123 4567
          </button>
          <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-white hover:text-blue-800 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
            <Mail className="inline mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Get Free Quote
          </button>
        </div>
        
        <div className="flex items-center justify-center text-gray-300 text-sm sm:text-base">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span>Serving Hirana, Panadura, and surrounding areas</span>
        </div>
      </div>
    </div>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "", isVisible = false }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isVisible || hasStarted) return;
    
    setHasStarted(true);
    let startTime;
    const startValue = 0;
    const endValue = parseInt(end.toString().replace(/[^0-9]/g, '')) || 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, hasStarted, end, duration]);

  const formatNumber = (num) => {
    if (end.includes('24/7')) return '24/7';
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K' + suffix;
    }
    return num.toString() + suffix;
  };

  return (
    <span className="tabular-nums">
      {end.includes('24/7') ? '24/7' : formatNumber(count)}
    </span>
  );
}

// Stats Section
function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    { number: "10000", suffix: "+", label: "Happy Customers", color: "from-blue-800 to-blue-900" },
    { number: "25", suffix: "+", label: "Years Experience", color: "from-emerald-800 to-green-900" },
    { number: "500", suffix: "+", label: "Products Available", color: "from-green-800 to-emerald-900" },
    { number: "24/7", suffix: "", label: "Support Available", color: "from-slate-800 to-slate-900" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the section is fully visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
            Numbers That Matter
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Our commitment to excellence reflected in achievements and customer satisfaction
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-2 sm:mb-3">
                <AnimatedCounter 
                  end={stat.number} 
                  suffix={stat.suffix}
                  isVisible={isVisible}
                  duration={2500 + (index * 200)}
                />
              </div>
              <div className="text-gray-600 text-base sm:text-lg font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// RSElectricals Home Page Component (the main landing page content)
function RSElectricalsHomePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <ProductCategories />
      <StatsSection />
      <TestimonialsSection />
      <ContactCTA />
      
      {/* Footer */}
      <footer className="bg-white text-gray-800 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 mr-2 rounded-lg overflow-hidden">
                  <img src="/logo.png" alt="R.S. Electricals" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg sm:text-xl font-bold">R.S. Electricals</span>
              </div>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Your trusted partner for premium electrical solutions since 2010.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors">
                  <span className="text-xs sm:text-sm font-bold text-white">f</span>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-xs sm:text-sm font-bold text-white">t</span>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 cursor-pointer transition-colors">
                  <span className="text-xs sm:text-sm font-bold text-white">y</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-gray-800 text-sm sm:text-base">Products</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-600">
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">Smart Switches</li>
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">LED Lighting</li>
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">Electrical Panels</li>
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">Cables & Wiring</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-gray-800 text-sm sm:text-base">Services</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-600">
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">Installation</li>
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">Maintenance</li>
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">Consultation</li>
                <li className="hover:text-gray-800 cursor-pointer transition-colors text-sm sm:text-base">Emergency Support</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-gray-800 text-sm sm:text-base">Contact Info</h4>
              <div className="space-y-2 sm:space-y-3 text-gray-600">
                <div className="flex items-center">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-sm sm:text-base">+94 77 123 4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-sm sm:text-base">info@rselectricals.lk</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 mt-1" />
                  <span className="text-sm sm:text-base">152/1, Main Road<br />Hirana, Panadura, Sri Lanka</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 text-center text-gray-600">
            <p className="text-xs sm:text-sm">&copy; 2025 R.S. Electricals. All rights reserved. | Designed with modern web technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Main Home Component with routing
export default function HomePage() {
  return (
    <div className="w-full min-h-screen">
      <Routes path="/*">
        {/* Routes without header (full-screen auth pages) */}
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        
        {/* Routes with header (main app pages) */}
        <Route path="/*" element={
          <div className="w-full h-screen flex flex-col items-center">
            <Header />
            <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center">
              <Routes>
                <Route path="/" element={<RSElectricalsHomePage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/contact" element={<h1>Contact</h1>} />
                <Route path="/overview/:id" element={<ProductOverview />} />
                <Route path="/*" element={<h1>404 Not Found</h1>} />
              </Routes>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}