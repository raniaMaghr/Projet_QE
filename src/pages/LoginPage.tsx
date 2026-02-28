/**
 * Page de connexion
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Mail,
  Lock,
  AlertCircle,
} from 'lucide-react';
import brainIllustration from 'figma:asset/8bbf05d78c8c01c04ddbd6460f4d0f9ab0303685.png';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // ✅ Redirection automatique dès que isAuthenticated devient true
  // Fonctionne que la redirection vienne du login ou d'un refresh de page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/qcm', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      await login(formData.email, formData.password);
      // ✅ Pas de navigate() ici — le useEffect s'en charge
      // quand isAuthenticated passera à true
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)' }}>
      {/* Header */}
      <header className="p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Logo variant="primary" size="md" />
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
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

            <div className="py-8 flex justify-center">
              <img 
                src={brainIllustration} 
                alt="Medical Brain Illustration - QE.tn" 
                className="w-full max-w-lg h-auto"
              />
            </div>

            <div className="hidden md:grid grid-cols-3 gap-4">
              <motion.div 
                whileHover={{ scale: 1.005, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm relative overflow-hidden border border-transparent hover:border-primary/30 transition-all duration-300"
              >
                <p className="text-2xl text-primary mb-1">10,000+</p>
                <p className="text-sm text-slate-600">Questions</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.005, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm relative overflow-hidden border border-transparent hover:border-primary/30 transition-all duration-300"
              >
                <p className="text-2xl text-accent mb-1">4 Facultés</p>
                <p className="text-sm text-slate-600">FMT, FMS, FMM, FMSf</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.005, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl p-4 text-center shadow-sm relative overflow-hidden border border-transparent hover:border-primary/30 transition-all duration-300"
              >
                <p className="text-2xl text-ecg-green mb-1">2022-2025</p>
                <p className="text-sm text-slate-600">Années d'examens</p>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-8">
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Connexion</h2>
                <p className="text-sm text-slate-600">
                  Connectez-vous pour accéder à votre espace personnel
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                      disabled={formLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleInputChange}
                      autoComplete="current-password"
                      required
                      disabled={formLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300" />
                    <span className="text-slate-600">Se souvenir de moi</span>
                  </label>
                  <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                    Mot de passe oublié ?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={formLoading}
                >
                  {formLoading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-slate-600">Pas encore de compte ? </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-primary/80"
                    onClick={() => navigate('/register')}
                  >
                    S'inscrire
                  </Button>
                </div>
              </form>
            </Card>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Mode Démo :</strong> Utilisez n'importe quel email/mot de passe pour vous connecter
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}