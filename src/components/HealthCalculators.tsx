import React, { useState } from 'react';
import { Activity, Droplet, Flame, Heart, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const HealthCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'water' | 'calories' | 'pulse'>('bmi');

  // BMI State
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<{ bmi: number; status: string; color: string; advice: string } | null>(null);

  // Water State
  const [waterWeight, setWaterWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [waterResult, setWaterResult] = useState<{ liters: number; glasses: number } | null>(null);

  // Calorie State
  const [calAge, setCalAge] = useState<string>('');
  const [calGender, setCalGender] = useState<'male' | 'female'>('male');
  const [calWeight, setCalWeight] = useState<string>('');
  const [calHeight, setCalHeight] = useState<string>('');
  const [calActivity, setCalActivity] = useState<number>(1.375);
  const [calorieResult, setCalorieResult] = useState<{ bmr: number; tdee: number } | null>(null);

  // Pulse State
  const [pulseAge, setPulseAge] = useState<string>('');
  const [pulseResting, setPulseResting] = useState<string>('70');
  const [pulseResult, setPulseResult] = useState<{
    maxHr: number;
    warmup: string;
    fatBurn: string;
    cardio: string;
    peak: string;
  } | null>(null);

  // BMI Calculation
  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(heightCm) / 100;
    const w = parseFloat(weightKg);

    if (!h || !w || h <= 0 || w <= 0) return;

    const bmi = parseFloat((w / (h * h)).toFixed(1));
    let status = '';
    let color = '';
    let advice = '';

    if (bmi < 18.5) {
      status = 'Kekurangan Berat Badan (Kurus)';
      color = 'text-amber-600 bg-amber-50 border-amber-200';
      advice = 'Disarankan menambah asupan gizi seimbang, nutrisi alami, dan terapi relaksasi otot untuk memperbaiki nafsu makan.';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      status = 'Berat Badan Ideal (Normal)';
      color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      advice = 'Sangat baik! Pertahankan pola makan sehat dan rutinitas pemeliharaan tubuh seperti bekam berkala untuk menjaga kebugaran.';
    } else if (bmi >= 25 && bmi <= 29.9) {
      status = 'Kelebihan Berat Badan (Gemuk)';
      color = 'text-orange-600 bg-orange-50 border-orange-200';
      advice = 'Disarankan menyesuaikan asupan kalori, berolahraga ringan secara teratur, serta terapi bekam sunnah untuk membantu metabolisme.';
    } else {
      status = 'Obesitas';
      color = 'text-rose-700 bg-rose-50 border-rose-200';
      advice = 'Sangat disarankan mengatur program penurunan berat badan, diet seimbang, detoksifikasi tubuh, dan terapi pijat/bekam teratur.';
    }

    setBmiResult({ bmi, status, color, advice });
  };

  // Water Calculation
  const calculateWater = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(waterWeight);
    if (!w || w <= 0) return;

    let multiplier = 35; // ml per kg
    if (activityLevel === 'moderate') multiplier = 40;
    if (activityLevel === 'active') multiplier = 45;

    const totalMl = w * multiplier;
    const liters = parseFloat((totalMl / 1000).toFixed(1));
    const glasses = Math.round(totalMl / 250); // 250ml per glass

    setWaterResult({ liters, glasses });
  };

  // Calorie Calculation
  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseFloat(calAge);
    const w = parseFloat(calWeight);
    const h = parseFloat(calHeight);

    if (!a || !w || !h) return;

    // Harris-Benedict Equation
    let bmr = 0;
    if (calGender === 'male') {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }

    const tdee = Math.round(bmr * calActivity);
    setCalorieResult({ bmr: Math.round(bmr), tdee });
  };

  // Pulse Calculation
  const calculatePulse = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseFloat(pulseAge);
    const resting = parseFloat(pulseResting) || 70;

    if (!age || age <= 0) return;

    const maxHr = 220 - age;
    const hrr = maxHr - resting; // Heart Rate Reserve

    const warmupMin = Math.round(resting + (hrr * 0.5));
    const warmupMax = Math.round(resting + (hrr * 0.6));

    const fatBurnMin = Math.round(resting + (hrr * 0.6));
    const fatBurnMax = Math.round(resting + (hrr * 0.7));

    const cardioMin = Math.round(resting + (hrr * 0.7));
    const cardioMax = Math.round(resting + (hrr * 0.8));

    const peakMin = Math.round(resting + (hrr * 0.8));
    const peakMax = Math.round(resting + (hrr * 0.9));

    setPulseResult({
      maxHr,
      warmup: `${warmupMin} - ${warmupMax} bpm`,
      fatBurn: `${fatBurnMin} - ${fatBurnMax} bpm`,
      cardio: `${cardioMin} - ${cardioMax} bpm`,
      peak: `${peakMin} - ${peakMax} bpm`,
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Calculator className="w-4 h-4" />
          Fitur Mandiri Kesehatan
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Kalkulator Kesehatan Praktis
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Hitung kebutuhan cairan, kalori harian, indeks berat badan, dan zona denyut nadi ideal secara otomatis.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('bmi')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'bmi'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>BMI / BBI</span>
        </button>

        <button
          onClick={() => setActiveTab('water')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'water'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Droplet className="w-4 h-4 text-cyan-600" />
          <span>Air Harian</span>
        </button>

        <button
          onClick={() => setActiveTab('calories')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'calories'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Kalori (BMR)</span>
        </button>

        <button
          onClick={() => setActiveTab('pulse')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'pulse'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>Denyut Nadi</span>
        </button>
      </div>

      {/* TAB 1: BMI */}
      {activeTab === 'bmi' && (
        <form onSubmit={calculateBMI} className="space-y-5 max-w-lg mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                placeholder="Contoh: 170"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                placeholder="Contoh: 65"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition"
          >
            Hitung Indeks BMI Saya
          </button>

          {bmiResult && (
            <div className={`mt-6 p-5 rounded-2xl border ${bmiResult.color} animate-in fade-in`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Hasil Perhitungan BMI</span>
                <span className="text-2xl font-black">{bmiResult.bmi}</span>
              </div>
              <h4 className="text-base font-extrabold">{bmiResult.status}</h4>
              <p className="mt-2 text-xs leading-relaxed opacity-90">{bmiResult.advice}</p>
            </div>
          )}
        </form>
      )}

      {/* TAB 2: WATER */}
      {activeTab === 'water' && (
        <form onSubmit={calculateWater} className="space-y-5 max-w-lg mx-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Berat Badan Anda (kg)
            </label>
            <input
              type="number"
              placeholder="Contoh: 60"
              value={waterWeight}
              onChange={(e) => setWaterWeight(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tingkat Aktivitas Harian
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="sedentary">Santai / Jarang Olahraga</option>
              <option value="moderate">Sedang / Bergerak Rutin</option>
              <option value="active">Aktif / Pekerja Lapangan / Olahragawan</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition"
          >
            Hitung Kebutuhan Air Minum
          </button>

          {waterResult && (
            <div className="mt-6 p-5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 animate-in fade-in">
              <div className="text-center">
                <Droplet className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Kebutuhan Cairan Ideal</span>
                <div className="text-3xl font-black text-cyan-700 my-1">{waterResult.liters} Liter / Hari</div>
                <p className="text-xs font-semibold text-cyan-800">Setara sekitar <strong>{waterResult.glasses} Gelas</strong> air mineral sehari.</p>
              </div>
              <p className="mt-3 text-xs text-cyan-700 leading-relaxed text-center">
                💡 Minum air yang cukup penting untuk melancarkan sirkulasi darah, membantu regenerasi pembuluh darah setelah bekam, dan mencegah dehidrasi.
              </p>
            </div>
          )}
        </form>
      )}

      {/* TAB 3: CALORIES */}
      {activeTab === 'calories' && (
        <form onSubmit={calculateCalories} className="space-y-5 max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Usia (Tahun)</label>
              <input
                type="number"
                placeholder="Contoh: 30"
                value={calAge}
                onChange={(e) => setCalAge(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
              <select
                value={calGender}
                onChange={(e) => setCalGender(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="male">Pria</option>
                <option value="female">Wanita</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Berat (kg)</label>
              <input
                type="number"
                placeholder="Contoh: 65"
                value={calWeight}
                onChange={(e) => setCalWeight(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tinggi (cm)</label>
              <input
                type="number"
                placeholder="Contoh: 168"
                value={calHeight}
                onChange={(e) => setCalHeight(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tingkat Aktivitas Fisik</label>
            <select
              value={calActivity}
              onChange={(e) => setCalActivity(parseFloat(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value={1.2}>Minim Aktivitas / Kerja Duduk</option>
              <option value={1.375}>Ringan (Olahraga 1-3 hari/minggu)</option>
              <option value={1.55}>Sedang (Olahraga 3-5 hari/minggu)</option>
              <option value={1.725}>Berat (Olahraga 6-7 hari/minggu)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition"
          >
            Hitung Kebutuhan Kalori
          </button>

          {calorieResult && (
            <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Metabolisme Basal (BMR)</span>
                  <div className="text-xl font-black text-amber-800">{calorieResult.bmr} kcal</div>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Kebutuhan Harian (TDEE)</span>
                  <div className="text-xl font-black text-amber-800">{calorieResult.tdee} kcal</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-amber-800 text-center leading-relaxed">
                TDEE adalah total estimasi energi yang dibakar tubuh Anda per hari.
              </p>
            </div>
          )}
        </form>
      )}

      {/* TAB 4: PULSE */}
      {activeTab === 'pulse' && (
        <form onSubmit={calculatePulse} className="space-y-5 max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Usia Anda (Tahun)</label>
              <input
                type="number"
                placeholder="Contoh: 35"
                value={pulseAge}
                onChange={(e) => setPulseAge(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nadi Istirahat (bpm)</label>
              <input
                type="number"
                placeholder="Default: 70"
                value={pulseResting}
                onChange={(e) => setPulseResting(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition"
          >
            Hitung Zona Denyut Nadi
          </button>

          {pulseResult && (
            <div className="mt-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 animate-in fade-in space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                <span className="text-xs font-bold uppercase">Maksimum Denyut Nadi (HR Max)</span>
                <span className="text-lg font-black text-rose-700">{pulseResult.maxHr} bpm</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-700 block">Zona Relaksasi / Pemanasan</span>
                  <span>{pulseResult.warmup}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-700 block">Zona Pembakaran Lemak</span>
                  <span>{pulseResult.fatBurn}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-700 block">Zona Aerobik / Kardio</span>
                  <span>{pulseResult.cardio}</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="font-bold text-rose-700 block">Zona Maksimal Aktivitas</span>
                  <span>{pulseResult.peak}</span>
                </div>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
};
