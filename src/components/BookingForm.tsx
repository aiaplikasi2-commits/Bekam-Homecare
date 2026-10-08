import React, { useState } from 'react';
import type { Service, ContactInfo } from '../types';
import { createBooking } from '../services/dataService';
import { Calendar, Clock, MapPin, User, Phone, FileText, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface BookingFormProps {
  services: Service[];
  contactInfo: ContactInfo | null;
  selectedServiceId?: string;
  onSuccess?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  services,
  contactInfo,
  selectedServiceId,
  onSuccess
}) => {
  const [clientName, setClientName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; service: string; date: string; time: string } | null>(null);

  // Set default selected service if prop provided
  React.useEffect(() => {
    if (selectedServiceId && services.length > 0) {
      const match = services.find(s => s.id === selectedServiceId);
      if (match) {
        setServiceName(match.name);
      }
    } else if (services.length > 0 && !serviceName) {
      setServiceName(services[0].name);
    }
  }, [selectedServiceId, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientName || !whatsappNumber || !address || !serviceName || !bookingDate || !bookingTime) {
      setError('Harap isi semua kolom wajib di atas.');
      return;
    }

    setLoading(true);
    try {
      const matchedService = services.find(s => s.name === serviceName);
      const bookingId = await createBooking({
        clientName,
        whatsappNumber,
        address,
        serviceId: matchedService?.id || '',
        serviceName,
        bookingDate,
        bookingTime,
        notes
      });

      if (bookingId) {
        setConfirmedBooking({
          id: bookingId,
          service: serviceName,
          date: bookingDate,
          time: bookingTime
        });
        if (onSuccess) onSuccess();
      } else {
        setError('Gagal membuat pesanan. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memproses booking.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!confirmedBooking) return '#';
    const cleanWaNum = contactInfo?.whatsappNumber ? contactInfo.whatsappNumber.replace(/[^0-9]/g, '') : '';
    const formattedWa = cleanWaNum.startsWith('0') ? '62' + cleanWaNum.slice(1) : cleanWaNum;

    const message = encodeURIComponent(
      `Halo Terapis, saya ingin konfirmasi Booking Layanan Panggilan:\n\n` +
      `📌 ID Booking: ${confirmedBooking.id}\n` +
      `👤 Nama: ${clientName}\n` +
      `📱 WA: ${whatsappNumber}\n` +
      `💆 Layanan: ${confirmedBooking.service}\n` +
      `📅 Tanggal: ${confirmedBooking.date}\n` +
      `⏰ Jam: ${confirmedBooking.time}\n` +
      `📍 Alamat: ${address}\n` +
      (notes ? `📝 Catatan: ${notes}\n` : '') +
      `\nMohon informasi konfirmasi jadwalnya. Terima kasih!`
    );

    return formattedWa ? `https://wa.me/${formattedWa}?text=${message}` : `https://wa.me/?text=${message}`;
  };

  if (confirmedBooking) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-emerald-200 dark:border-emerald-800/40 shadow-2xl text-center animate-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Permintaan Booking Berhasil Dikirim!
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Nomor Booking: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{confirmedBooking.id}</strong>
        </p>

        <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left text-xs sm:text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Nama Pelanggan:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Layanan:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{confirmedBooking.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Jadwal:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{confirmedBooking.date} ({confirmedBooking.time})</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Klik tombol di bawah ini untuk langsung terhubung ke WhatsApp terapis dan mengonfirmasi jadwal panggilan ke rumah Anda.
        </p>

        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 px-6 text-sm font-bold text-white shadow-xl transition-all hover:scale-[1.01]"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          <span>Konfirmasi Langsung via WhatsApp</span>
        </a>

        <button
          onClick={() => {
            setConfirmedBooking(null);
            setClientName('');
            setWhatsappNumber('');
            setAddress('');
            setNotes('');
          }}
          className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
        >
          + Buat Booking Baru
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-600" />
          Form Booking Layanan Panggilan
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Isi formulir singkat di bawah ini. Terapis akan menyiapkan peralatan steril dan langsung menuju lokasi rumah Anda.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            Nama Lengkap <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap Anda"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              Nomor WhatsApp <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Layanan <span className="text-rose-500">*</span>
            </label>
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {services.length === 0 ? (
                <option value="">(Belum ada data layanan diatur)</option>
              ) : (
                services.map((srv) => (
                  <option key={srv.id || srv.name} value={srv.name}>
                    {srv.name} {srv.priceRp ? `— Rp ${srv.priceRp.toLocaleString('id-ID')}` : ''} ({srv.durationMinutes || 60} Menit)
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Alamat Lengkap / Share Location <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="Masukkan alamat rumah lengkap, jalan, nomor rumah, patokan, atau link Google Maps"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Rencana Tanggal <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Pilihan Jam <span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            Catatan Tambahan (Opsional)
          </label>
          <input
            type="text"
            placeholder="Contoh: Pegal bahu berat, ada tangga ke lantai 2, dll."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || services.length === 0}
          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 py-3.5 px-6 text-sm font-bold text-white shadow-xl transition-all"
        >
          {loading ? 'Mengirim Permintaan Booking...' : 'Kirim Booking Online Sekarang'}
        </button>
      </form>
    </div>
  );
};
