/**
 * Page d'inscription
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts';
import { Faculte, AnneeEtude } from '../types/qcm.types';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Mail,
  Lock,
  AlertCircle,
  User,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import brainIllustration from 'figma:asset/8bbf05d78c8c01c04ddbd6460f4d0f9ab0303685.png';

const FACULTIES: { value: Faculte; label: string }[] = [
  { value: 'FMT', label: 'FMT - Faculté de Médecine de Tunis' },
  { value: 'FMSf', label: 'FMSf - Faculté de Médecine de Sfax' },
  { value: 'FMS', label: 'FMS - Faculté de Médecine de Sousse' },
  { value: 'FMM', label: 'FMM - Faculté de Médecine de Monastir' },
];

const YEARS: { value: AnneeEtude; label: string }[] = [
  { value: 'J1', label: 'J1 - 1ère année' },
  { value: 'J2', label: 'J2 - 2ème année' },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    faculty: '' as Faculte | '',
    year: '' as AnneeEtude | '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Le prénom est requis');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email invalide');
      return false;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (!formData.faculty) {
      setError('Veuillez sélectionner votre faculté');
      return false;
    }
    if (!formData.year) {
      setError('Veuillez sélectionner votre année d\'études');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        faculty: formData.faculty as Faculte,
        year: formData.year as AnneeEtude,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
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
                Rejoignez <span className="font-bold tracking-tight"><span className="text-medical-blue">QE</span><span className="text-medical-orange">.tn</span></span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 font-[Abhaya_Libre_Medium] text-[16px]">
                Créez votre compte et commencez à vous préparer pour le résidanat
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

          {/* Right Side - Registration Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 p-8">
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Créer un compte</h2>
                <p className="text-sm text-slate-600">
                  Remplissez le formulaire pour vous inscrire
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Nom et Prénom sur la même ligne */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Prénom"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Nom"
                        className="pl-10"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
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
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Faculté */}
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculté</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                    <select
                      id="faculty"
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                      required
                      disabled={loading}
                    >
                      <option value="">Sélectionnez votre faculté</option>
                      {FACULTIES.map((faculty) => (
                        <option key={faculty.value} value={faculty.value}>
                          {faculty.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Année d'études */}
                <div className="space-y-2">
                  <Label htmlFor="year">Année d'études</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                      required
                      disabled={loading}
                    >
                      <option value="">Sélectionnez votre année</option>
                      {YEARS.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mot de passe */}
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
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Au moins 6 caractères</p>
                </div>

                {/* Confirmation du mot de passe */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Termes et conditions */}
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    required
                    disabled={loading}
                    className="mt-1 rounded border-slate-300" 
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600">
                    J'accepte les{' '}
                    <a href="#" className="text-primary hover:underline">
                      conditions d'utilisation
                    </a>
                    {' '}et la{' '}
                    <a href="#" className="text-primary hover:underline">
                      politique de confidentialité
                    </a>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Inscription en cours...' : 'Créer mon compte'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-slate-600">Vous avez déjà un compte ? </span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-primary/80"
                    onClick={() => navigate('/login')}
                    disabled={loading}
                  >
                    Se connecter
                  </Button>
                </div>
              </form>
            </Card>

            {/* Demo Info */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Mode Démo :</strong> Utilisez n'importe quelles informations pour créer un compte de test
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}