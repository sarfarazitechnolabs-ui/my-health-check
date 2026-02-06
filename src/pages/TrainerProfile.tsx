import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Phone, Award, Star, Users, Calendar, Instagram, Youtube, Twitter, Share2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

// Mock trainer data
const mockTrainer = {
  id: "1",
  name: "Rahul Sharma",
  username: "rahulsharma",
  avatar: "",
  coverImage: "",
  title: "Certified Personal Trainer & Nutrition Coach",
  bio: "Passionate about transforming lives through fitness. 8+ years of experience helping clients achieve their dream physique. Specializing in weight loss, muscle building, and sports-specific training.",
  location: "Mumbai, India",
  email: "rahul@fitcoach.com",
  phone: "+91 98765 43210",
  experience: "8+ years",
  clientsTransformed: 500,
  rating: 4.9,
  reviewCount: 127,
  verified: true,
  specializations: ["Weight Loss", "Muscle Building", "Sports Training", "Nutrition"],
  socials: {
    instagram: "rahul_fitness",
    youtube: "RahulFitnessOfficial",
    twitter: "rahulfit",
  },
};

const mockCertifications = [
  { id: "c1", name: "NASM Certified Personal Trainer", issuer: "National Academy of Sports Medicine", year: "2018", visible: true },
  { id: "c2", name: "Precision Nutrition Level 1", issuer: "Precision Nutrition", year: "2019", visible: true },
  { id: "c3", name: "CrossFit Level 2 Trainer", issuer: "CrossFit Inc.", year: "2020", visible: true },
  { id: "c4", name: "Sports Nutrition Specialist", issuer: "ISSA", year: "2021", visible: true },
];

const mockTransformations = [
  {
    id: "t1",
    clientName: "Amit K.",
    duration: "6 months",
    weightLost: "25 kg",
    beforeImage: "",
    afterImage: "",
    testimonial: "Rahul's guidance completely changed my life. I lost 25kg and gained so much confidence!",
    visible: true,
  },
  {
    id: "t2",
    clientName: "Priya M.",
    duration: "4 months",
    weightLost: "15 kg",
    beforeImage: "",
    afterImage: "",
    testimonial: "The best decision I made was joining Rahul's program. Professional and motivating!",
    visible: true,
  },
  {
    id: "t3",
    clientName: "Vikram S.",
    duration: "8 months",
    weightLost: "Gained 12 kg muscle",
    beforeImage: "",
    afterImage: "",
    testimonial: "From skinny to fit! Rahul's muscle building program is incredible.",
    visible: true,
  },
];

const mockReviews = [
  {
    id: "r1",
    clientName: "Neha Gupta",
    avatar: "",
    rating: 5,
    date: "2026-01-15",
    text: "Absolutely amazing trainer! Rahul is knowledgeable, patient, and really understands how to push you to your limits while keeping it safe. Highly recommend!",
    visible: true,
  },
  {
    id: "r2",
    clientName: "Arjun Patel",
    avatar: "",
    rating: 5,
    date: "2026-01-10",
    text: "I've worked with many trainers before, but Rahul is on another level. His nutrition advice alone was worth it. Lost 10kg in 3 months!",
    visible: true,
  },
  {
    id: "r3",
    clientName: "Sneha Reddy",
    avatar: "",
    rating: 4,
    date: "2025-12-28",
    text: "Great trainer with a personalized approach. The workout plans are challenging but effective. Would definitely recommend.",
    visible: true,
  },
  {
    id: "r4",
    clientName: "Rohit Kumar",
    avatar: "",
    rating: 5,
    date: "2025-12-15",
    text: "Rahul helped me prepare for my first marathon. His expertise in sports training is unmatched. Completed my marathon with a great time!",
    visible: true,
  },
];

const TrainerProfile = () => {
  const { username } = useParams();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Profile link copied to clipboard",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30" />
      </div>

      {/* Profile Header */}
      <div className="container px-4 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={mockTrainer.avatar} />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {mockTrainer.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{mockTrainer.name}</h1>
                  {mockTrainer.verified && (
                    <CheckCircle2 className="h-6 w-6 text-primary fill-primary/20" />
                  )}
                </div>
                <p className="text-muted-foreground">{mockTrainer.title}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {mockTrainer.location}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button>Contact Trainer</Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">{mockTrainer.clientsTransformed}+</p>
                  <p className="text-xs text-muted-foreground">Clients Transformed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-bold">{mockTrainer.rating}</p>
                  <p className="text-xs text-muted-foreground">{mockTrainer.reviewCount} Reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-bold">{mockTrainer.experience}</p>
                  <p className="text-xs text-muted-foreground">Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container px-4 py-8">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="transformations">Transformations</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">About Me</h3>
                <p className="text-muted-foreground leading-relaxed">{mockTrainer.bio}</p>
                
                <Separator className="my-6" />
                
                <h3 className="font-semibold mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {mockTrainer.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-6" />

                <h3 className="font-semibold mb-3">Connect</h3>
                <div className="flex gap-3">
                  {mockTrainer.socials.instagram && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={`https://instagram.com/${mockTrainer.socials.instagram}`} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {mockTrainer.socials.youtube && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={`https://youtube.com/${mockTrainer.socials.youtube}`} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {mockTrainer.socials.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={`https://twitter.com/${mockTrainer.socials.twitter}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transformations Tab */}
          <TabsContent value="transformations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTransformations.filter(t => t.visible).map((transformation) => (
                <Card key={transformation.id} className="overflow-hidden">
                  <div className="grid grid-cols-2 h-48">
                    <div className="bg-muted flex items-center justify-center text-muted-foreground text-sm border-r">
                      Before
                    </div>
                    <div className="bg-primary/5 flex items-center justify-center text-primary text-sm">
                      After
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{transformation.clientName}</p>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        {transformation.weightLost}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Duration: {transformation.duration}</p>
                    <p className="text-sm text-muted-foreground italic">"{transformation.testimonial}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-4xl font-bold">{mockTrainer.rating}</p>
                <div className="flex gap-0.5 my-1">{renderStars(mockTrainer.rating)}</div>
                <p className="text-sm text-muted-foreground">{mockTrainer.reviewCount} reviews</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {mockReviews.filter(r => r.visible).map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>
                          {review.clientName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{review.clientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex gap-0.5 my-1">{renderStars(review.rating)}</div>
                        <p className="text-sm text-muted-foreground mt-2">{review.text}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-4">
            <div className="grid gap-4">
              {mockCertifications.filter(c => c.visible).map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                    <Badge variant="outline">{cert.year}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TrainerProfile;
