import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Plus, Trash2, GripVertical, Upload, Save, ExternalLink, Award, ImageIcon, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Mock data
const initialProfile = {
  name: "Rahul Sharma",
  username: "rahulsharma",
  title: "Certified Personal Trainer & Nutrition Coach",
  bio: "Passionate about transforming lives through fitness. 8+ years of experience helping clients achieve their dream physique.",
  location: "Mumbai, India",
  email: "rahul@fitcoach.com",
  phone: "+91 98765 43210",
  instagram: "rahul_fitness",
  youtube: "RahulFitnessOfficial",
  twitter: "rahulfit",
  specializations: ["Weight Loss", "Muscle Building", "Sports Training", "Nutrition"],
};

const initialCertifications = [
  { id: "c1", name: "NASM Certified Personal Trainer", issuer: "National Academy of Sports Medicine", year: "2018", visible: true },
  { id: "c2", name: "Precision Nutrition Level 1", issuer: "Precision Nutrition", year: "2019", visible: true },
  { id: "c3", name: "CrossFit Level 2 Trainer", issuer: "CrossFit Inc.", year: "2020", visible: false },
];

const initialTransformations = [
  { id: "t1", clientName: "Amit K.", duration: "6 months", result: "Lost 25 kg", testimonial: "Rahul's guidance completely changed my life!", visible: true },
  { id: "t2", clientName: "Priya M.", duration: "4 months", result: "Lost 15 kg", testimonial: "The best decision I made was joining Rahul's program.", visible: true },
  { id: "t3", clientName: "Vikram S.", duration: "8 months", result: "Gained 12 kg muscle", testimonial: "From skinny to fit! Incredible program.", visible: false },
];

const initialReviews = [
  { id: "r1", clientName: "Neha Gupta", rating: 5, text: "Absolutely amazing trainer! Highly recommend!", date: "2026-01-15", visible: true },
  { id: "r2", clientName: "Arjun Patel", rating: 5, text: "Rahul is on another level. Lost 10kg in 3 months!", date: "2026-01-10", visible: true },
  { id: "r3", clientName: "Sneha Reddy", rating: 4, text: "Great trainer with a personalized approach.", date: "2025-12-28", visible: false },
];

const ProfileSettings = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [transformations, setTransformations] = useState(initialTransformations);
  const [reviews, setReviews] = useState(initialReviews);
  
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [isAddTransformationOpen, setIsAddTransformationOpen] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", issuer: "", year: "" });
  const [newTransformation, setNewTransformation] = useState({ clientName: "", duration: "", result: "", testimonial: "" });

  const toggleVisibility = (type: "cert" | "transformation" | "review", id: string) => {
    if (type === "cert") {
      setCertifications(certs => certs.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
    } else if (type === "transformation") {
      setTransformations(trans => trans.map(t => t.id === id ? { ...t, visible: !t.visible } : t));
    } else {
      setReviews(revs => revs.map(r => r.id === id ? { ...r, visible: !r.visible } : r));
    }
    toast({ title: "Visibility updated" });
  };

  const handleAddCertification = () => {
    if (!newCert.name || !newCert.issuer) return;
    setCertifications([...certifications, { id: `c${Date.now()}`, ...newCert, visible: true }]);
    setNewCert({ name: "", issuer: "", year: "" });
    setIsAddCertOpen(false);
    toast({ title: "Certification added" });
  };

  const handleAddTransformation = () => {
    if (!newTransformation.clientName || !newTransformation.result) return;
    setTransformations([...transformations, { id: `t${Date.now()}`, ...newTransformation, visible: true }]);
    setNewTransformation({ clientName: "", duration: "", result: "", testimonial: "" });
    setIsAddTransformationOpen(false);
    toast({ title: "Transformation added" });
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications(certs => certs.filter(c => c.id !== id));
    toast({ title: "Certification removed" });
  };

  const handleDeleteTransformation = (id: string) => {
    setTransformations(trans => trans.filter(t => t.id !== id));
    toast({ title: "Transformation removed" });
  };

  const handleSave = () => {
    toast({ title: "Profile saved", description: "Your changes have been saved successfully." });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your public profile</p>
          </div>
          <Button variant="outline" asChild>
            <Link to={`/trainer/${profile.username}`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              View Profile
            </Link>
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic" className="gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="certifications" className="gap-2">
              <Award className="h-4 w-4" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="transformations" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Transformations
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>This information will be displayed on your public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Upload Photo</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        fitcoach.app/
                      </span>
                      <Input 
                        className="rounded-l-none"
                        value={profile.username} 
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Professional Title</Label>
                    <Input 
                      value={profile.title} 
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Bio</Label>
                    <Textarea 
                      rows={4}
                      value={profile.bio} 
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      value={profile.location} 
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block">Social Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Instagram</Label>
                      <Input 
                        placeholder="username"
                        value={profile.instagram} 
                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">YouTube</Label>
                      <Input 
                        placeholder="channel name"
                        value={profile.youtube} 
                        onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Twitter</Label>
                      <Input 
                        placeholder="username"
                        value={profile.twitter} 
                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Certifications</h3>
                <p className="text-sm text-muted-foreground">Manage your professional certifications</p>
              </div>
              <Button onClick={() => setIsAddCertOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Certification
              </Button>
            </div>

            <div className="space-y-3">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.year}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility("cert", cert.id)}
                        className={cert.visible ? "text-primary" : "text-muted-foreground"}
                      >
                        {cert.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transformations Tab */}
          <TabsContent value="transformations" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Client Transformations</h3>
                <p className="text-sm text-muted-foreground">Showcase your client success stories</p>
              </div>
              <Button onClick={() => setIsAddTransformationOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Transformation
              </Button>
            </div>

            <div className="grid gap-4">
              {transformations.map((trans) => (
                <Card key={trans.id}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="grid grid-cols-2 gap-1 w-24 h-16 rounded overflow-hidden flex-shrink-0">
                      <div className="bg-muted flex items-center justify-center text-[10px] text-muted-foreground">Before</div>
                      <div className="bg-primary/10 flex items-center justify-center text-[10px] text-primary">After</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{trans.clientName}</p>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                          {trans.result}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{trans.duration}</p>
                      <p className="text-sm text-muted-foreground italic mt-1">"{trans.testimonial}"</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={trans.visible ? "default" : "secondary"} className="text-xs">
                        {trans.visible ? "Visible" : "Hidden"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility("transformation", trans.id)}
                        className={trans.visible ? "text-primary" : "text-muted-foreground"}
                      >
                        {trans.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTransformation(trans.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div>
              <h3 className="font-semibold">Client Reviews</h3>
              <p className="text-sm text-muted-foreground">Toggle which reviews appear on your public profile</p>
            </div>

            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{review.clientName}</p>
                        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(review.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={review.visible ? "default" : "secondary"} className="text-xs">
                        {review.visible ? "Visible" : "Hidden"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility("review", review.id)}
                        className={review.visible ? "text-primary" : "text-muted-foreground"}
                      >
                        {review.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Certification Modal */}
      <Dialog open={isAddCertOpen} onOpenChange={setIsAddCertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
            <DialogDescription>Add a new professional certification to your profile</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Certification Name</Label>
              <Input 
                placeholder="e.g., NASM Certified Personal Trainer"
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Issuing Organization</Label>
              <Input 
                placeholder="e.g., National Academy of Sports Medicine"
                value={newCert.issuer}
                onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Year Obtained</Label>
              <Input 
                placeholder="e.g., 2023"
                value={newCert.year}
                onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCertOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCertification}>Add Certification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transformation Modal */}
      <Dialog open={isAddTransformationOpen} onOpenChange={setIsAddTransformationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transformation</DialogTitle>
            <DialogDescription>Showcase a client's transformation journey</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Before Photo</Label>
                <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50">
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">Upload</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>After Photo</Label>
                <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50">
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">Upload</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input 
                  placeholder="e.g., Amit K."
                  value={newTransformation.clientName}
                  onChange={(e) => setNewTransformation({ ...newTransformation, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input 
                  placeholder="e.g., 6 months"
                  value={newTransformation.duration}
                  onChange={(e) => setNewTransformation({ ...newTransformation, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Result</Label>
              <Input 
                placeholder="e.g., Lost 25 kg"
                value={newTransformation.result}
                onChange={(e) => setNewTransformation({ ...newTransformation, result: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Testimonial (Optional)</Label>
              <Textarea 
                placeholder="Client's feedback about their journey..."
                value={newTransformation.testimonial}
                onChange={(e) => setNewTransformation({ ...newTransformation, testimonial: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTransformationOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTransformation}>Add Transformation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
