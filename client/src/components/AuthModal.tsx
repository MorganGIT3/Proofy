import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { signUpUser, signInUser, resetPassword } from "@/lib/supabase";
import { useAuthSound } from "@/hooks/useAuthSound";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
}

export function AuthModal({ open, onOpenChange, onAuthSuccess }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "", 
    name: "" 
  });
  const [resetEmail, setResetEmail] = useState("");
  const { playAuthSound } = useAuthSound();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playAuthSound();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signInUser(loginData.email, loginData.password);
      
      if (error) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      if (data.user) {
        console.log('Connexion réussie:', data.user);
        onAuthSuccess?.();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    playAuthSound();
    setIsLoading(true);
    setError("");

    try {
      console.log('Tentative d\'inscription...');
      const { data, error } = await signUpUser(signupData.email, signupData.password, signupData.name);
      
      console.log('Réponse inscription:', { data, error });
      
      if (error) {
        console.error('Erreur inscription:', error);
        
        // Messages d'erreur plus clairs
        let errorMessage = "Erreur lors de la création du compte";
        const errorMsg = error.message?.toLowerCase() || '';
        
        if (errorMsg.includes('already registered') || errorMsg.includes('already exists') || errorMsg.includes('user already registered')) {
          errorMessage = "Cet email est déjà utilisé";
        } else if (errorMsg.includes('invalid email') || errorMsg.includes('email')) {
          errorMessage = "Adresse email invalide";
        } else if (errorMsg.includes('password') || errorMsg.includes('weak')) {
          errorMessage = "Mot de passe trop faible";
        } else if (errorMsg.includes('database') || errorMsg.includes('saving') || errorMsg.includes('profile')) {
          errorMessage = "Erreur lors de la sauvegarde du profil. Votre compte a été créé, veuillez vous connecter.";
        } else {
          errorMessage = error.message || "Une erreur est survenue lors de la création du compte";
        }
        
        setError(errorMessage);
        return;
      }

      if (data?.user) {
        // Si une session existe, l'utilisateur est connecté automatiquement
        if (data.session) {
          setSuccess("Compte créé avec succès ! Redirection...");
          setTimeout(() => {
            onAuthSuccess?.();
            onOpenChange(false);
          }, 1000);
        } else {
          // Compte créé mais nécessite confirmation email ou connexion
          // On permet quand même l'accès pour tester
          setSuccess("Compte créé avec succès ! Redirection...");
          setTimeout(() => {
            onAuthSuccess?.();
            onOpenChange(false);
          }, 1500);
        }
      } else {
        setError("Erreur : aucun utilisateur créé. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setError("Une erreur est survenue lors de la création du compte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await resetPassword(resetEmail);
      
      if (error) {
        let errorMessage = "Erreur lors de l'envoi de l'email de réinitialisation";
        if (error.message.includes('Invalid email')) {
          errorMessage = "Adresse email invalide";
        } else if (error.message.includes('rate limit')) {
          errorMessage = "Trop de tentatives. Veuillez attendre quelques minutes";
        } else {
          errorMessage = error.message;
        }
        setError(errorMessage);
        return;
      }

      setSuccess("Un email de réinitialisation a été envoyé à votre adresse email.");
      setResetEmail("");
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      setError("Une erreur est survenue lors de l'envoi de l'email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-0 overflow-hidden rounded-3xl z-[200]">
        <div className="relative w-full overflow-hidden rounded-3xl">
          {/* Magnificent Blue Background with Animation */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://media.giphy.com/media/xJT7pzbviKNqTqF1Ps/giphy.gif"
              alt="Tunnel animation"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-gray-900/95 to-black/98" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-800/70 to-black/90" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 py-14">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-center text-white">
                Bienvenu dans <span className="text-white">RizeAppHub™</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 border-white/20">
                <TabsTrigger 
                  value="login" 
                  data-testid="tab-login"
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  data-testid="tab-signup"
                  className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                >
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardHeader className="px-0 pb-4">
                    <CardTitle className="text-white text-xl font-semibold">Se connecter</CardTitle>
                    <CardDescription className="text-white/70">
                      Connectez-vous à votre compte pour accéder au dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-white">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          data-testid="input-login-email"
                          className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 rounded-2xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-white">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            data-testid="input-login-password"
                            className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 rounded-2xl"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg border border-gray-300" 
                        data-testid="button-login-submit"
                      >
                        {isLoading ? "Connexion..." : "Se connecter"}
                      </Button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-gray-200 hover:text-white text-sm underline transition-colors duration-200"
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="signup">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardHeader className="px-0 pb-4">
                    <CardTitle className="text-white text-xl font-semibold">Créer un compte</CardTitle>
                    <CardDescription className="text-white/70">
                      Commencez votre essai gratuit de 14 jours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-white">Nom complet</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Votre nom"
                          value={signupData.name}
                          onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                          data-testid="input-signup-name"
                          className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 rounded-2xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-white">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                          data-testid="input-signup-email"
                          className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 rounded-2xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-white">Mot de passe</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                          data-testid="input-signup-password"
                          className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 rounded-2xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="text-white">Confirmer le mot de passe</Label>
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          data-testid="input-signup-confirm"
                          className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 rounded-2xl"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg border border-gray-300" 
                        data-testid="button-signup-submit"
                      >
                        {isLoading ? "Création..." : "Créer mon compte"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Modal de réinitialisation de mot de passe */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md p-0 border-0 overflow-hidden rounded-3xl z-[300]">
          <div className="relative w-full overflow-hidden rounded-3xl">
            {/* Background */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://media.giphy.com/media/xJT7pzbviKNqTqF1Ps/giphy.gif"
                alt="Tunnel animation"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-gray-900/95 to-black/98" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-gray-800/70 to-black/90" />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 py-14">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold text-center text-white">
                  Réinitialiser le mot de passe
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}
                
                <Card className="border-0 shadow-none bg-transparent">
                  <CardHeader className="px-0 pb-4">
                    <CardTitle className="text-white text-xl font-semibold">Email de réinitialisation</CardTitle>
                    <CardDescription className="text-white/70">
                      Entrez votre adresse email pour recevoir un lien de réinitialisation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email" className="text-white">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="votre@email.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/40 rounded-2xl"
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => setShowForgotPassword(false)}
                          className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-lg"
                        >
                          Annuler
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg" 
                        >
                          {isLoading ? "Envoi..." : "Envoyer"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}