import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  increment
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import type {
  TherapistProfile,
  Service,
  Activity,
  GalleryItem,
  Article,
  Testimonial,
  Booking,
  BookingStatus,
  ServiceArea,
  ContactInfo,
  VisitorStats
} from '../types';

// Helper to return all documents for single-therapist site
function filterByOwner<T extends { ownerId?: string }>(items: T[]): T[] {
  return items;
}

// THERAPIST PROFILE
export async function getTherapistProfile(): Promise<TherapistProfile | null> {
  const uid = auth.currentUser?.uid;
  try {
    if (uid) {
      const userRef = doc(db, 'therapistProfile', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as TherapistProfile;
      }
    }
    const defaultRef = doc(db, 'therapistProfile', 'default');
    const defaultSnap = await getDoc(defaultRef);
    if (defaultSnap.exists()) {
      return { id: defaultSnap.id, ...defaultSnap.data() } as TherapistProfile;
    }
    const colRef = collection(db, 'therapistProfile');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as TherapistProfile;
    }
    return null;
  } catch (error) {
    console.warn('getTherapistProfile notice:', error);
    return null;
  }
}

export async function saveTherapistProfile(data: Partial<TherapistProfile>): Promise<void> {
  const uid = auth.currentUser?.uid || 'default';
  try {
    const docRef = doc(db, 'therapistProfile', uid);
    const payload = { ...data, ownerId: uid, updatedAt: new Date().toISOString() };
    await setDoc(docRef, payload, { merge: true });

    // Also sync to default so public visitors see the updated profile
    const defaultRef = doc(db, 'therapistProfile', 'default');
    await setDoc(defaultRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `therapistProfile/${uid}`);
  }
}

// SERVICES
export async function getServices(): Promise<Service[]> {
  try {
    const colRef = collection(db, 'services');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Service & { ownerId?: string }));
    const filtered = filterByOwner(list);
    return filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.warn('getServices notice:', error);
    return [];
  }
}

export async function addService(data: Omit<Service, 'id'>): Promise<string> {
  const path = 'services';
  try {
    const colRef = collection(db, 'services');
    const uid = auth.currentUser?.uid || '';
    const res = await addDoc(colRef, {
      ...data,
      ownerId: uid,
      createdAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  const path = `services/${id}`;
  try {
    const docRef = doc(db, 'services', id);
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteService(id: string): Promise<void> {
  const path = `services/${id}`;
  try {
    const docRef = doc(db, 'services', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ACTIVITIES
export async function getActivities(): Promise<Activity[]> {
  try {
    const colRef = collection(db, 'activities');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Activity & { ownerId?: string }));
    const filtered = filterByOwner(list);
    return filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.warn('getActivities notice:', error);
    return [];
  }
}

export async function addActivity(data: Omit<Activity, 'id'>): Promise<string> {
  const path = 'activities';
  try {
    const colRef = collection(db, 'activities');
    const uid = auth.currentUser?.uid || '';
    const res = await addDoc(colRef, {
      ...data,
      ownerId: uid,
      createdAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function deleteActivity(id: string): Promise<void> {
  const path = `activities/${id}`;
  try {
    const docRef = doc(db, 'activities', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// GALLERY
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const colRef = collection(db, 'gallery');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as GalleryItem & { ownerId?: string }));
    const filtered = filterByOwner(list);
    return filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.warn('getGalleryItems notice:', error);
    return [];
  }
}

export async function addGalleryItem(data: Omit<GalleryItem, 'id'>): Promise<string> {
  const path = 'gallery';
  try {
    const colRef = collection(db, 'gallery');
    const uid = auth.currentUser?.uid || '';
    const res = await addDoc(colRef, {
      ...data,
      ownerId: uid,
      createdAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    const docRef = doc(db, 'gallery', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ARTICLES
export async function getArticles(includeDrafts = false): Promise<Article[]> {
  try {
    const colRef = collection(db, 'articles');
    const snap = await getDocs(colRef);
    const articles = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Article & { ownerId?: string }));
    const filtered = includeDrafts ? articles : articles.filter(a => !a.isDraft);
    return filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.warn('getArticles notice:', error);
    return [];
  }
}

export async function addArticle(data: Omit<Article, 'id'>): Promise<string> {
  const path = 'articles';
  try {
    const colRef = collection(db, 'articles');
    const uid = auth.currentUser?.uid || '';
    const res = await addDoc(colRef, {
      ...data,
      ownerId: uid,
      createdAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function updateArticle(id: string, data: Partial<Article>): Promise<void> {
  const path = `articles/${id}`;
  try {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const path = `articles/${id}`;
  try {
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// TESTIMONIALS
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const colRef = collection(db, 'testimonials');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Testimonial & { ownerId?: string }));
    const filtered = filterByOwner(list);
    return filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.warn('getTestimonials notice:', error);
    return [];
  }
}

export async function addTestimonial(data: Omit<Testimonial, 'id'>): Promise<string> {
  const path = 'testimonials';
  try {
    const colRef = collection(db, 'testimonials');
    const uid = auth.currentUser?.uid || '';
    const res = await addDoc(colRef, {
      ...data,
      ownerId: uid,
      createdAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    const docRef = doc(db, 'testimonials', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// BOOKINGS
export async function createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<string> {
  const path = 'bookings';
  try {
    const colRef = collection(db, 'bookings');
    const uid = auth.currentUser?.uid || 'public_visitor';
    const res = await addDoc(colRef, {
      ...data,
      ownerId: uid,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const colRef = collection(db, 'bookings');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Booking & { ownerId?: string }));
    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.warn('getBookings notice:', error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const path = `bookings/${id}`;
  try {
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteBooking(id: string): Promise<void> {
  const path = `bookings/${id}`;
  try {
    const docRef = doc(db, 'bookings', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// SERVICE AREAS
export async function getServiceAreas(): Promise<ServiceArea[]> {
  try {
    const colRef = collection(db, 'serviceAreas');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as ServiceArea & { ownerId?: string }));
    const filtered = filterByOwner(list);
    return filtered.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } catch (error) {
    console.warn('getServiceAreas notice:', error);
    return [];
  }
}

export async function addServiceArea(data: Omit<ServiceArea, 'id'>): Promise<string> {
  const path = 'serviceAreas';
  try {
    const colRef = collection(db, 'serviceAreas');
    const uid = auth.currentUser?.uid || '';
    const res = await addDoc(colRef, {
      ...data,
      ownerId: uid,
      createdAt: new Date().toISOString()
    });
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function deleteServiceArea(id: string): Promise<void> {
  const path = `serviceAreas/${id}`;
  try {
    const docRef = doc(db, 'serviceAreas', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// CONTACT INFO
export async function getContactInfo(): Promise<ContactInfo | null> {
  const uid = auth.currentUser?.uid;
  try {
    if (uid) {
      const userRef = doc(db, 'contactInfo', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as ContactInfo;
      }
    }
    const defaultRef = doc(db, 'contactInfo', 'default');
    const defaultSnap = await getDoc(defaultRef);
    if (defaultSnap.exists()) {
      return { id: defaultSnap.id, ...defaultSnap.data() } as ContactInfo;
    }
    const colRef = collection(db, 'contactInfo');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as ContactInfo;
    }
    return null;
  } catch (error) {
    console.warn('getContactInfo notice:', error);
    return null;
  }
}

export async function saveContactInfo(data: Partial<ContactInfo>): Promise<void> {
  const uid = auth.currentUser?.uid || 'default';
  try {
    const docRef = doc(db, 'contactInfo', uid);
    const payload = { ...data, ownerId: uid, updatedAt: new Date().toISOString() };
    await setDoc(docRef, payload, { merge: true });

    const defaultRef = doc(db, 'contactInfo', 'default');
    await setDoc(defaultRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `contactInfo/${uid}`);
  }
}

// VISITOR STATS
export async function incrementVisitorCount(): Promise<number> {
  const path = 'visitorStats/main';
  try {
    const docRef = doc(db, 'visitorStats', 'main');
    await setDoc(docRef, {
      totalVisits: increment(1),
      lastVisited: new Date().toISOString()
    }, { merge: true });

    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return (snap.data().totalVisits || 1) as number;
    }
    return 1;
  } catch (error) {
    console.warn('Visitor counter increment warning:', error);
    return 1;
  }
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const path = 'visitorStats/main';
  try {
    const docRef = doc(db, 'visitorStats', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as VisitorStats;
    }
    return { totalVisits: 0 };
  } catch (error) {
    return { totalVisits: 0 };
  }
}

// FULL BACKUP EXPORT & IMPORT
export async function exportFullDatabaseBackup() {
  const profile = await getTherapistProfile();
  const services = await getServices();
  const activities = await getActivities();
  const gallery = await getGalleryItems();
  const articles = await getArticles(true);
  const testimonials = await getTestimonials();
  const bookings = await getBookings();
  const serviceAreas = await getServiceAreas();
  const contact = await getContactInfo();
  const stats = await getVisitorStats();

  return {
    exportDate: new Date().toISOString(),
    version: '1.0',
    therapistProfile: profile,
    services,
    activities,
    gallery,
    articles,
    testimonials,
    bookings,
    serviceAreas,
    contactInfo: contact,
    visitorStats: stats,
  };
}

export async function restoreFullDatabaseBackup(backupJsonData: any) {
  if (!backupJsonData) throw new Error('Data backup tidak valid.');

  if (backupJsonData.therapistProfile) {
    await saveTherapistProfile(backupJsonData.therapistProfile);
  }
  if (backupJsonData.contactInfo) {
    await saveContactInfo(backupJsonData.contactInfo);
  }
  if (Array.isArray(backupJsonData.services)) {
    for (const item of backupJsonData.services) {
      const { id, ...data } = item;
      await addService(data);
    }
  }
  if (Array.isArray(backupJsonData.activities)) {
    for (const item of backupJsonData.activities) {
      const { id, ...data } = item;
      await addActivity(data);
    }
  }
  if (Array.isArray(backupJsonData.gallery)) {
    for (const item of backupJsonData.gallery) {
      const { id, ...data } = item;
      await addGalleryItem(data);
    }
  }
  if (Array.isArray(backupJsonData.articles)) {
    for (const item of backupJsonData.articles) {
      const { id, ...data } = item;
      await addArticle(data);
    }
  }
  if (Array.isArray(backupJsonData.testimonials)) {
    for (const item of backupJsonData.testimonials) {
      const { id, ...data } = item;
      await addTestimonial(data);
    }
  }
  if (Array.isArray(backupJsonData.serviceAreas)) {
    for (const item of backupJsonData.serviceAreas) {
      const { id, ...data } = item;
      await addServiceArea(data);
    }
  }
}

// ALLOWED ADMIN EMAILS (RESTRICTED ADMIN ACCESS)
const PRIMARY_OWNER_EMAIL = 'jamurtv69@gmail.com';

export async function getAllowedAdminEmails(): Promise<string[]> {
  const defaultAdmins = [PRIMARY_OWNER_EMAIL];
  try {
    const docRef = doc(db, 'settings', 'allowed_admins');
    const snap = await getDoc(docRef);
    if (snap.exists() && Array.isArray(snap.data()?.emails)) {
      const stored: string[] = snap.data().emails;
      const merged = Array.from(new Set([...defaultAdmins, ...stored.map(e => e.trim().toLowerCase())]));
      return merged.length > 0 ? merged : defaultAdmins;
    } else {
      await setDoc(docRef, { emails: defaultAdmins, updatedAt: new Date().toISOString() }, { merge: true });
      return defaultAdmins;
    }
  } catch (error) {
    console.warn('getAllowedAdminEmails notice:', error);
    return defaultAdmins;
  }
}

export async function addAllowedAdminEmail(email: string): Promise<string[]> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return await getAllowedAdminEmails();
  
  try {
    const current = await getAllowedAdminEmails();
    if (!current.includes(normalized)) {
      const updated = [...current, normalized];
      const docRef = doc(db, 'settings', 'allowed_admins');
      await setDoc(docRef, { emails: updated, updatedAt: new Date().toISOString() }, { merge: true });
      return updated;
    }
    return current;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/allowed_admins');
    return await getAllowedAdminEmails();
  }
}

export async function removeAllowedAdminEmail(email: string): Promise<string[]> {
  const normalized = email.trim().toLowerCase();
  if (normalized === PRIMARY_OWNER_EMAIL) {
    throw new Error(`Email pemilik utama (${PRIMARY_OWNER_EMAIL}) tidak dapat dihapus.`);
  }
  
  try {
    const current = await getAllowedAdminEmails();
    const updated = current.filter(e => e.toLowerCase() !== normalized);
    const docRef = doc(db, 'settings', 'allowed_admins');
    await setDoc(docRef, { emails: updated, updatedAt: new Date().toISOString() }, { merge: true });
    return updated;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'settings/allowed_admins');
    return await getAllowedAdminEmails();
  }
}

export async function isEmailAllowed(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (normalized === PRIMARY_OWNER_EMAIL) return true;
  
  const allowed = await getAllowedAdminEmails();
  return allowed.some(e => e.toLowerCase() === normalized);
}
