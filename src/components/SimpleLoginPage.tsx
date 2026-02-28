import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Mail,
  Lock
} from 'lucide-react';
import brainIllustration from '../assets/8bbf05d78c8c01c04ddbd6460f4d0f9ab0303685.png';


interface SimpleLoginPageProps {
  onNavigate: (page: string) => void;
}

export function SimpleLoginPage({ onNavigate }: SimpleLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Redirection vers l'application après connexion
    onNavigate('app');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)' }}>
      {/* Header */}
      <header className="p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Logo variant="primary" size="md" />
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Retour à l'accueil
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Information */}
          <div className="hidden lg:block space-y-8">
            
            <div>
              <h1 className="text-3xl lg:text-4xl mb-4">
                Bienvenue sur <span className="font-bold tracking-tight"><span className="text-medical-blue">QE</span><span className="text-medical-orange">.tn</span></span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 font-[Abhaya_Libre_Medium] text-[16px]">
                La plateforme de référence pour réussir votre résidanat en Tunisie
              </p>
            </div>

            {/* Medical Brain Illustration */}
            <div className="py-8 flex justify-center">
              <img 
                src={brainIllustration} 
                alt="Medical Brain Illustration - QE.tn" 
                className="w-full max-w-lg h-auto"
              />
            </div>

            {/* Success Stats */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.005, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm relative overflow-hidden border border-transparent hover:border-primary/30 transition-all duration-300"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/4 to-transparent opacity-70 pointer-events-none z-0"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="relative z-10">
                  <p className="text-2xl mb-1" style={{ color: '#4f7cff' }}>15K+</p>
                  <p className="text-sm text-slate-600">QCM disponibles</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.005, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm relative overflow-hidden border border-transparent hover:border-accent/30 transition-all duration-300"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-accent/8 via-primary/4 to-transparent opacity-70 pointer-events-none z-0"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="relative z-10">
                  <p className="text-2xl mb-1" style={{ color: '#ff8f00' }}>2K+</p>
                  <p className="text-sm text-slate-600">Étudiants actifs</p>
                </div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.005, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm relative overflow-hidden border border-transparent hover:border-success/30 transition-all duration-300"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-success/8 via-accent/4 to-transparent opacity-70 pointer-events-none z-0"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="relative z-10">
                  <p className="text-2xl mb-1" style={{ color: '#059669' }}>94%</p>
                  <p className="text-sm text-slate-600">Taux de réussite</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <Card className="w-full p-6 bg-white shadow-xl border-0 rounded-2xl relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-transparent opacity-70 pointer-events-none z-0"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <div className="relative z-10">
              
              <div className="text-center mb-6">
                <h2 className="text-2xl mb-2">Connectez-vous</h2>
                <p className="text-slate-500 text-sm">Accédez à votre espace de formation</p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  variant="outline" 
                  className="w-full py-3 border-slate-200 hover:bg-slate-50 rounded-lg text-sm justify-center"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full py-3 border-slate-200 hover:bg-slate-50 rounded-lg text-sm justify-center"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuer avec Facebook
                </Button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 px-4 text-sm text-slate-400">Ou bien</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-slate-700">Adresse email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 py-2.5 text-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-slate-700">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 py-2.5 text-sm border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                    />
                    <label htmlFor="remember" className="text-sm text-slate-600">
                      Se souvenir de moi
                    </label>
                  </div>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#4f7cff' }}>
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full text-white py-2.5 hover:opacity-90 transition-all rounded-lg text-sm"
                  style={{ backgroundColor: '#4f7cff' }}
                >
                  Se connecter
                  <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                </Button>

                {/* Sign up link */}
                <div className="text-center text-sm text-slate-600 mt-4">
                  Nouveau sur QE.tn ?{' '}
                  <a href="#" className="hover:underline" style={{ color: '#4f7cff' }}>
                    Créer un compte
                  </a>
                </div>
              </form>
              </div>
            </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}