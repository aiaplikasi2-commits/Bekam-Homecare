export interface TherapistProfile {
  id?: string;
  name: string;
  photoUrl: string;
  experienceYears: string;
  certificates: string[];
  expertise: string[];
  bio: string;
  vision: string;
  mission: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerPhotoUrl: string;
  ctaText: string;
  updatedAt?: string;
}

export interface Service {
  id?: string;
  name: string;
  photoUrl: string;
  description: string;
  durationMinutes: number;
  priceRp: number;
  notes: string;
  createdAt?: string;
}

export interface Activity {
  id?: string;
  title: string;
  description: string;
  photos: string[];
  activityDate: string;
  createdAt?: string;
}

export interface GalleryItem {
  id?: string;
  title: string;
  category: string;
  photoUrl: string;
  description: string;
  createdAt?: string;
}

export interface Article {
  id?: string;
  title: string;
  imageUrl: string;
  content: string;
  category: string;
  publishedDate: string;
  isDraft: boolean;
  createdAt?: string;
}

export interface Testimonial {
  id?: string;
  clientName: string;
  photoUrl: string;
  rating: number;
  reviewText: string;
  date: string;
  createdAt?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id?: string;
  clientName: string;
  whatsappNumber: string;
  address: string;
  serviceId?: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  notes: string;
  status: BookingStatus;
  createdAt?: string;
}

export interface ServiceArea {
  id?: string;
  districtName: string;
  radiusKm: number;
  notes: string;
  mapEmbedUrl: string;
  createdAt?: string;
}

export interface ContactInfo {
  id?: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  updatedAt?: string;
}

export interface VisitorStats {
  id?: string;
  totalVisits: number;
  lastVisited?: string;
}
