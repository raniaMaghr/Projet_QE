import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { ECGPattern } from './ECGPattern';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Play, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Stethoscope, 
  GraduationCap, 
  Heart,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface SimpleHomePageProps {
  onNavigate: (page: string) => void;
}

export function SimpleHomePage({ onNavigate }: SimpleHomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Logo variant="primary" size="md" />
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-slate-600 hover:text-blue-600">Fonctionnalités</a>
              <a href="#courses" className="text-slate-600 hover:text-blue-600">Cours</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600">À propos</a>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                className="text-white"
                style={{ backgroundColor: '#4f7cff' }}
                onClick={() => onNavigate('login')}
              >
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl">
                Réussissez votre <span style={{ color: '#4f7cff' }}>Résidanat</span>
                <br />avec <span style={{ color: '#ff8f00' }}>QE.tn</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                La plateforme de référence pour préparer le concours de résidanat en médecine en Tunisie. 
                Excellence médicale et innovation pédagogique réunies.
              </p>
            </div>
            
            {/* ECG Animation */}
            <div className="py-8">
              <ECGPattern 
                animated={true} 
                color="#4f7cff" 
                className="max-w-3xl mx-auto"
              />
              <p className="text-xs text-slate-500 text-center mt-2">
                Battements d'excellence • Innovation médicale
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="text-white px-6" 
                style={{ backgroundColor: '#4f7cff' }}
                onClick={() => onNavigate('login')}
              >
                <CheckCircle className="mr-2 w-4 h-4" />
                Commencer Maintenant
              </Button>
              <Button variant="outline" className="px-6">
                <Play className="mr-2 w-4 h-4" />
                Voir la Démo
              </Button>
            </div>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <p className="text-3xl mb-1" style={{ color: '#4f7cff' }}>92%</p>
                <p className="text-slate-600 text-sm">Taux de réussite</p>
              </div>
              <div className="text-center">
                <p className="text-3xl mb-1" style={{ color: '#ff8f00' }}>15,000+</p>
                <p className="text-slate-600 text-sm">QCM disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-3xl mb-1" style={{ color: '#059669' }}>24/7</p>
                <p className="text-slate-600 text-sm">Support</p>
              </div>
              <div className="text-center">
                <p className="text-3xl mb-1" style={{ color: '#dc2626' }}>500+</p>
                <p className="text-slate-600 text-sm">Étudiants actifs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Fonctionnalités d'Excellence</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Des outils innovants pour la réussite au résidanat tunisien
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.005, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 text-center relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0"
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
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 pointer-events-none z-0"
                  whileHover={{
                    background: [
                      'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                      'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
                      'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8" style={{ color: '#4f7cff' }} />
                  </div>
                  <h3 className="text-lg mb-3">Cours Structurés</h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    Contenu pédagogique organisé par spécialités médicales
                  </p>
                  <Badge className="text-white" style={{ backgroundColor: '#4f7cff' }}>
                    100+ Heures
                  </Badge>
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.005, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 text-center relative overflow-hidden border-2 hover:border-accent/50 transition-all duration-300">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-accent/12 via-primary/6 to-transparent opacity-70 pointer-events-none z-0"
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
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-accent/0 to-primary/0 pointer-events-none z-0"
                  whileHover={{
                    background: [
                      'radial-gradient(circle at 50% 50%, rgba(255, 143, 0, 0.08) 0%, rgba(79, 124, 255, 0) 70%)',
                      'radial-gradient(circle at 50% 50%, rgba(255, 143, 0, 0.12) 0%, rgba(79, 124, 255, 0.03) 70%)',
                      'radial-gradient(circle at 50% 50%, rgba(255, 143, 0, 0.08) 0%, rgba(79, 124, 255, 0) 70%)',
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8" style={{ color: '#ff8f00' }} />
                  </div>
                  <h3 className="text-lg mb-3">QCM Intelligents</h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    Questions adaptatives avec explications détaillées
                  </p>
                  <Badge className="text-white" style={{ backgroundColor: '#ff8f00' }}>
                    15,000+ Questions
                  </Badge>
                </div>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.005, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 text-center relative overflow-hidden border-2 hover:border-success/50 transition-all duration-300">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-success/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0"
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
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-success/0 to-accent/0 pointer-events-none z-0"
                  whileHover={{
                    background: [
                      'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                      'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
                      'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                    ]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8" style={{ color: '#059669' }} />
                  </div>
                  <h3 className="text-lg mb-3">Suivi Médical</h3>
                  <p className="text-slate-600 mb-4 text-sm">
                    Progression personnalisée selon votre spécialité
                  </p>
                  <Badge className="text-white" style={{ backgroundColor: '#059669' }}>
                    Temps Réel
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="courses" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Spécialités Médicales</h2>
            <p className="text-lg text-slate-600">
              Préparation complète pour toutes les spécialités
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Cardiologie', icon: Heart, color: '#dc2626', courses: 45 },
              { name: 'Neurologie', icon: GraduationCap, color: '#4f7cff', courses: 38 },
              { name: 'Chirurgie', icon: Stethoscope, color: '#059669', courses: 52 },
              { name: 'Pédiatrie', icon: Users, color: '#ff8f00', courses: 41 }
            ].map((specialty, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.005, y: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-4 text-center relative overflow-hidden border-2 hover:border-primary/30 transition-all duration-300">
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
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <specialty.icon className="w-6 h-6" style={{ color: specialty.color }} />
                    </div>
                    <h4 className="mb-1 text-sm">{specialty.name}</h4>
                    <p className="text-xs text-slate-600 mb-2">{specialty.courses} cours</p>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Accéder
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white" style={{ backgroundColor: '#4f7cff' }}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl">Commencez Votre Préparation</h2>
            <p className="text-lg opacity-90">
              Rejoignez des centaines d'étudiants qui font confiance à QE.tn
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white px-6"
                style={{ color: '#4f7cff' }}
                onClick={() => onNavigate('login')}
              >
                Inscription Gratuite
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6">
                Réserver une Démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            <div>
              <Logo variant="white" size="sm" />
              <p className="text-slate-400 text-sm mt-2">
                Plateforme d'excellence pour la préparation au résidanat médical
              </p>
            </div>
            
            <div>
              <h4 className="text-white mb-2 md:mb-3 text-sm">Plateforme</h4>
              <div className="space-y-1">
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Cours</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">QCM</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Examens</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white mb-2 md:mb-3 text-sm">Support</h4>
              <div className="space-y-1">
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Aide</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Contact</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">FAQ</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white mb-2 md:mb-3 text-sm">Légal</h4>
              <div className="space-y-1">
                <a href="#" className="block text-slate-400 hover:text-white text-sm">CGU</a>
                <a href="#" className="block text-slate-400 hover:text-white text-sm">Confidentialité</a>
              </div>
            </div>
          </div>
          
          <div className="pt-4 md:pt-6 border-t border-slate-700 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 QE.tn - Plateforme d'apprentissage médical pour la Tunisie
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}