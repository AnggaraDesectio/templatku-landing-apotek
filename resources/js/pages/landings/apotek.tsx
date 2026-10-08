// Landing page APOTEK FARMA 24, apotek 24 jam di Surabaya.
// Self-contained: tidak memakai AuthenticatedLayout, tidak menerima props.
// Header/nav + footer inline.
import { useMemo, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import { CountdownTimer } from '@/components/countdown-timer';
import {
    Baby,
    Bike,
    CheckCircle2,
    Clock,
    Cross,
    BriefcaseMedical,
    MapPin,
    Menu,
    MessageCircle,
    Pill,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    X,
    type LucideIcon,
} from 'lucide-react';

// Format rupiah gaya Indonesia.
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

interface Produk {
    nama: string;
    harga: number;
    satuan: string;
    deskripsi: string;
    icon: LucideIcon;
    promo?: string;
}

const KATALOG: Record<'vitamin' | 'p3k' | 'ibuanak', Produk[]> = {
    vitamin: [
        { nama: 'Vitamin C 500mg (30 tablet)', harga: 28000, satuan: 'botol', deskripsi: 'Menjaga daya tahan tubuh, cocok untuk aktivitas padat.', icon: Pill, promo: 'Hemat 15%' },
        { nama: 'Vitamin D3 1000 IU (60 kapsul)', harga: 95000, satuan: 'botol', deskripsi: 'Kesehatan tulang dan imunitas, penting bagi yang jarang kena matahari.', icon: Sparkles },
        { nama: 'Multivitamin Harian (30 kaplet)', harga: 65000, satuan: 'strip', deskripsi: 'Kombinasi A–Z untuk kebutuhan vitamin harian keluarga.', icon: Pill, promo: 'Beli 2 gratis 1' },
        { nama: 'Zinc + Echinacea (20 kapsul)', harga: 45000, satuan: 'box', deskripsi: 'Dukungan imunitas saat musim pancaroba.', icon: ShieldCheck },
        { nama: 'Madu Murni 500ml', harga: 120000, satuan: 'botol', deskripsi: 'Madu hutan asli, tanpa campuran gula.', icon: Sparkles },
        { nama: 'Minyak Ikan Omega-3 (30 kapsul)', harga: 78000, satuan: 'botol', deskripsi: 'Menjaga kesehatan jantung dan fungsi otak.', icon: Pill },
    ],
    p3k: [
        { nama: 'Plester Luka Waterproof (50 pcs)', harga: 22000, satuan: 'box', deskripsi: 'Plester anti air berbagai ukuran untuk kotak P3K.', icon: BriefcaseMedical, promo: 'Hemat 10%' },
        { nama: 'Betadine Antiseptik 30ml', harga: 18000, satuan: 'botol', deskripsi: 'Antiseptik untuk luka ringan dan lecet.', icon: Cross },
        { nama: 'Perban Elastis 10cm', harga: 25000, satuan: 'roll', deskripsi: 'Perban lentur untuk keseleo dan penyangga sendi.', icon: BriefcaseMedical },
        { nama: 'Termometer Digital', harga: 55000, satuan: 'pcs', deskripsi: 'Pengukur suhu akurat dalam 10 detik, wajib ada di rumah.', icon: Cross },
        { nama: 'Minyak Kayu Putih 60ml', harga: 32000, satuan: 'botol', deskripsi: 'Penghangat badan, perut kembung, dan gigitan serangga.', icon: Sparkles },
        { nama: 'Tas P3K Lengkap', harga: 150000, satuan: 'set', deskripsi: 'Satu set isi 25 item untuk rumah, kantor, dan mobil.', icon: BriefcaseMedical, promo: 'Best seller' },
    ],
    ibuanak: [
        { nama: 'Susu Formula Bayi 800g', harga: 185000, satuan: 'kaleng', deskripsi: 'Nutrisi lengkap untuk bayi 0–6 bulan.', icon: Baby },
        { nama: 'Popok Bayi (44 pcs)', harga: 58000, satuan: 'pack', deskripsi: 'Daya serap tinggi, lembut di kulit bayi.', icon: Baby, promo: 'Hemat 12%' },
        { nama: 'Vitamin Ibu Hamil (30 tablet)', harga: 89000, satuan: 'botol', deskripsi: 'Asam folat + zat besi untuk kehamilan sehat.', icon: Pill },
        { nama: 'Tisu Basah Bayi (80 lembar)', harga: 24000, satuan: 'pack', deskripsi: 'Bebas alkohol, aman untuk kulit sensitif.', icon: Baby },
        { nama: 'Sabun Mandi Bayi 200ml', harga: 42000, satuan: 'botol', deskripsi: 'pH seimbang, tidak pedih di mata.', icon: Sparkles },
        { nama: 'Suplemen ASI Booster (30 kapsul)', harga: 110000, satuan: 'botol', deskripsi: 'Herbal katuk dan fenugreek untuk kelancaran ASI.', icon: Pill, promo: 'Promo bulan ini' },
    ],
};

const TAB_KATALOG = [
    { value: 'vitamin', label: 'Vitamin & Suplemen' },
    { value: 'p3k', label: 'P3K' },
    { value: 'ibuanak', label: 'Ibu & Anak' },
] as const;

const LAYANAN_ANTAR = [
    { judul: 'Pesan via WhatsApp', deskripsi: 'Kirim foto resep atau nama obat, apoteker kami yang siapkan.' },
    { judul: 'Gratis Ongkir < 5 KM', deskripsi: 'Pengiriman gratis radius 5 km, flat Rp10.000 untuk 5–10 km.' },
    { judul: 'Sampai 30–60 Menit', deskripsi: 'Kurir khusus obat berangkat segera setelah obat siap.' },
    { judul: 'Pembayaran Fleksibel', deskripsi: 'Tunai, transfer, QRIS, atau e-wallet saat obat diterima.' },
];

const STATS = [
    { label: 'Produk tersedia', value: 5000, suffix: '+' },
    { label: 'Pelanggan setia', value: 32000, suffix: '+' },
    { label: 'Rata-rata rating', value: 48, suffix: '/50', display: '4.8' },
    { label: 'Menit waktu antar', value: 45, suffix: '' },
];

const GALERI = [
    { judul: 'Rak obat tertata rapi', foto: '/images/landing-apotek/galeri-rak-obat.jpg' },
    { judul: 'Dilayani apoteker berlisensi', foto: '/images/landing-apotek/galeri-apoteker.jpg' },
    { judul: 'Produk asli ber-BPOM', foto: '/images/landing-apotek/galeri-botol-obat.jpg' },
    { judul: 'Toko kami di Surabaya', foto: '/images/landing-apotek/galeri-toko.jpg' },
];

export default function ApotekLanding() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [tabAktif, setTabAktif] = useState<'vitamin' | 'p3k' | 'ibuanak'>('vitamin');

    // Form konsultasi apoteker.
    const [namaKonsul, setNamaKonsul] = useState('');
    const [keluhan, setKeluhan] = useState('');
    const [konsulOk, setKonsulOk] = useState(false);

    // Promo berakhir 7 hari dari sekarang.
    const promoBerakhir = useMemo(() => Date.now() + 7 * 24 * 3600 * 1000, []);

    function kirimKonsultasi(e: FormEvent) {
        e.preventDefault();
        if (!namaKonsul.trim() || !keluhan.trim()) return;
        setKonsulOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#katalog', label: 'Katalog' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#antar', label: 'Layanan Antar' },
        { href: '#konsultasi', label: 'Konsultasi' },
        { href: '#lokasi', label: 'Lokasi' },
    ];

    return (
        <div className="min-h-screen bg-sky-50/60 pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-blue-900/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600">
                            <Cross className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                            APOTEK <span className="text-blue-700">FARMA 24</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-blue-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-blue-700 hover:bg-blue-800 sm:inline-flex" asChild>
                        <a href="https://wa.me/6281334567890?text=Halo%20Apotek%20Farma%2024!%20Saya%20ingin%20pesan%20obat." target="_blank" rel="noreferrer">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Pesan via WhatsApp
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-blue-900/10 px-4 py-2 lg:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-blue-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-cyan-900 text-white">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,.12) 0, transparent 40%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">
                            <Clock className="mr-1.5 h-3.5 w-3.5" /> Buka 24 Jam Setiap Hari
                        </Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Obat Sampai 30–60 Menit, <span className="text-cyan-300">Bahkan Jam 3 Pagi.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-blue-100/90">
                            5.000+ produk asli ber-BPOM, apoteker siaga 24 jam. Kirim foto resep via WhatsApp,
                            kurir khusus obat langsung berangkat, gratis ongkir radius 5 km.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50" asChild>
                                <a href="https://wa.me/6281334567890?text=Halo%20Apotek%20Farma%2024!%20Saya%20ingin%20pesan%20obat." target="_blank" rel="noreferrer">
                                    Pesan via WhatsApp
                                </a>
                            </Button>
                            <a href="#katalog" className="text-sm font-semibold text-cyan-100 underline-offset-4 hover:underline">
                                atau lihat katalog dulu →
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-blue-100/90">
                            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> 100% obat asli ber-BPOM</span>
                            <span className="flex items-center gap-1.5"><Truck className="h-4 w-4" /> Antar 24 jam</span>
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-yellow-300 text-yellow-300" /> 4.8 (5.600+ ulasan)</span>
                        </div>
                    </div>
                    <div className="relative mx-auto hidden w-full max-w-md sm:flex lg:max-w-lg">
                        <img src="/images/landing-apotek/hero.jpg" alt="Interior Apotek Farma 24" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
                        <div className="absolute top-4 right-4 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-blue-800 shadow-lg">Apoteker Siaga 24 Jam</div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-cyan-950 px-4 py-2 text-xs font-semibold text-cyan-100 shadow-lg">
                            <Bike className="h-4 w-4" /> Antar 30–60 menit
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {STATS.map((s) => (
                        <Card key={s.label} className="text-center">
                            <CardContent className="p-5">
                                {s.display ? (
                                    <p className="text-3xl font-extrabold text-blue-700">{s.display}</p>
                                ) : (
                                    <StatCounter value={s.value} suffix={s.suffix} className="text-3xl font-extrabold text-blue-700" />
                                )}
                                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Promo dengan countdown */}
            <section className="mx-auto max-w-6xl px-4 pb-4">
                <Card className="overflow-hidden border-blue-200 bg-gradient-to-r from-blue-700 to-cyan-700 text-white">
                    <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between sm:p-8">
                        <div>
                            <Badge className="bg-yellow-400 text-yellow-950 hover:bg-yellow-400">PROMO AKHIR BULAN</Badge>
                            <p className="mt-2 text-xl font-extrabold sm:text-2xl">Diskon s.d. 25% + gratis ongkir untuk semua vitamin</p>
                            <p className="mt-1 text-sm text-blue-100">Berlaku untuk pembelian via WhatsApp dan di toko.</p>
                        </div>
                        <div className="text-center">
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-100">Berakhir dalam</p>
                            <CountdownTimer target={promoBerakhir} className="[&_span]:bg-white/20 [&_span]:text-white" />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Katalog */}
            <section id="katalog" className="mx-auto max-w-6xl px-4 py-12">
                <div className="text-center">
                    <Badge variant="outline" className="border-blue-700/30 text-blue-700">Katalog Produk</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Kebutuhan Kesehatan Keluarga</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Harga sudah termasuk PPN. Stok diperbarui setiap hari.</p>
                </div>
                <Tabs value={tabAktif} onValueChange={(v) => setTabAktif(v as typeof tabAktif)} className="mt-8">
                    <TabsList className="mx-auto flex w-full max-w-xl bg-blue-900/10">
                        {TAB_KATALOG.map((t) => (
                            <TabsTrigger key={t.value} value={t.value} className="flex-1 data-[state=active]:bg-white">
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {TAB_KATALOG.map((t) => (
                        <TabsContent key={t.value} value={t.value}>
                            <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                                {KATALOG[t.value].map((p) => (
                                    <Card key={p.nama} className="overflow-hidden transition-shadow hover:shadow-md">
                                        <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-50 to-sky-100">
                                            <p.icon className="h-11 w-11 text-blue-700" strokeWidth={1.5} />
                                            {p.promo && <Badge className="absolute top-2 left-2 bg-red-600 text-white hover:bg-red-600">{p.promo}</Badge>}
                                        </div>
                                        <CardContent className="p-4">
                                            <p className="font-semibold">{p.nama}</p>
                                            <p className="mt-1 text-sm text-stone-600">{p.deskripsi}</p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-blue-800">{rupiah(p.harga)}</p>
                                                    <p className="text-xs text-stone-500">per {p.satuan}</p>
                                                </div>
                                                <Button size="sm" className="bg-blue-700 hover:bg-blue-800" asChild>
                                                    <a
                                                        href={`https://wa.me/6281334567890?text=${encodeURIComponent(`Halo Apotek Farma 24! Saya mau pesan: ${p.nama} (${rupiah(p.harga)}/${p.satuan})`)}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Pesan via WA
                                                    </a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
                <p className="mt-4 text-center text-sm text-stone-500">
                    Obat keras (antibiotik, dll) hanya dilayani dengan resep dokter yang valid.
                </p>
            </section>

            {/* Galeri suasana apotek */}
            <section id="galeri" className="bg-stone-950 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Suasana Apotek Farma 24</h2>
                    <p className="mt-1 text-sm text-stone-400">Toko fisik kami yang buka 24 jam setiap hari.</p>
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="w-60 shrink-0 overflow-hidden rounded-xl sm:w-72">
                                <img src={g.foto} alt={g.judul} loading="lazy" className="h-40 w-full object-cover sm:h-48" />
                                <p className="bg-stone-900 px-3 py-2.5 text-sm font-medium text-stone-200">{g.judul}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Layanan antar */}
            <section id="antar" className="bg-white py-14">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="text-center">
                        <Badge variant="outline" className="border-blue-700/30 text-blue-700">Layanan Antar 24 Jam</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Obat Datang, Kamu Tetap di Rumah</h2>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {LAYANAN_ANTAR.map((l, i) => (
                            <Card key={l.judul}>
                                <CardContent className="p-5">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-lg font-extrabold text-white">{i + 1}</span>
                                    <p className="mt-3 font-bold">{l.judul}</p>
                                    <p className="mt-1 text-sm text-stone-600">{l.deskripsi}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                            <a href="https://wa.me/6281334567890?text=Halo%20Apotek%20Farma%2024!%20Saya%20ingin%20pesan%20obat." target="_blank" rel="noreferrer">
                                <MessageCircle className="mr-2 h-4 w-4" /> Pesan via WhatsApp
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Konsultasi apoteker */}
            <section id="konsultasi" className="mx-auto max-w-6xl px-4 py-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-blue-700/30 text-blue-700">Konsultasi Gratis</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Tanya Apoteker Dulu, Baru Beli</h2>
                        <p className="mt-2 text-stone-600">
                            Bingung memilih vitamin atau dosis obat? Ceritakan keluhanmu, apoteker kami
                            menjawab maksimal 5 menit, 24 jam sehari. Gratis, tanpa syarat.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Dijawab apoteker ber-STRA aktif, bukan bot', 'Saran dosis aman sesuai usia dan kondisi', 'Privasi keluhanmu terjaga sepenuhnya'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-blue-600 bg-white p-4 shadow-sm">
                            <blockquote className="text-sm italic text-stone-700">
                                “Jam 2 pagi anak demam 39°. Chat WhatsApp, paracetamol dan termometer
                                sampai 40 menit kemudian. Nggak jadi panik ke IGD.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-stone-500">
                                Pak Budi Santoso, pelanggan, Wonokromo, Februari 2026
                            </figcaption>
                        </figure>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-blue-700" /> Form Konsultasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {konsulOk ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Pesan terkirim!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{namaKonsul}</span>.
                                        Apoteker kami akan menghubungimu maksimal 5 menit dari sekarang.
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setKonsulOk(false); setNamaKonsul(''); setKeluhan(''); }}>
                                        Konsultasi lagi
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimKonsultasi} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ks-nama">Nama</Label>
                                        <Input id="ks-nama" placeholder="cth: Budi Santoso" value={namaKonsul} onChange={(e) => setNamaKonsul(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="ks-keluhan">Keluhan / pertanyaan</Label>
                                        <Textarea id="ks-keluhan" rows={4} placeholder="cth: Saya sering pusing saat bangun tidur, vitamin apa yang cocok?" value={keluhan} onChange={(e) => setKeluhan(e.target.value)} required />
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">Kirim ke Apoteker</Button>
                                    <p className="text-center text-xs text-stone-500">Respon maksimal 5 menit, 24 jam sehari.</p>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Lokasi */}
            <section id="lokasi" className="mx-auto max-w-6xl px-4 pb-16">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="relative min-h-64 bg-gradient-to-br from-blue-100 via-cyan-50 to-sky-100" aria-hidden>
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(30,90,180,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(30,90,180,.08) 0 2px, transparent 2px 40px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600 opacity-40" />
                                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 shadow-lg">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </span>
                                </span>
                                <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow">APOTEK FARMA 24</p>
                            </div>
                        </div>
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Kunjungi Kami</h2>
                            <div className="mt-4 space-y-3 text-sm text-stone-700">
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" /> Jl. Raya Darmo No. 120, Wonokromo, Surabaya 60241<br />(seberang RS Darmo)</p>
                                <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-blue-700" /> Buka 24 jam, 365 hari setahun</p>
                                <p className="flex items-center gap-2"><Truck className="h-4 w-4 shrink-0 text-blue-700" /> Area antar: seluruh Surabaya & Sidoarjo</p>
                            </div>
                            <Button size="lg" className="mt-6 w-full bg-green-600 hover:bg-green-700 sm:w-auto" asChild>
                                <a href="https://wa.me/6281334567890?text=Halo%20Apotek%20Farma%2024!" target="_blank" rel="noreferrer">
                                    Chat WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-blue-950 text-blue-200/80">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                                <Cross className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">APOTEK <span className="text-cyan-400">FARMA 24</span></span>
                        </div>
                        <p className="mt-3 text-sm">Apotek 24 jam terpercaya warga Surabaya sejak 2009. Izin apotek Dinkes Jatim.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Jam Operasional</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Toko: 24 jam setiap hari</li>
                            <li>Layanan antar: 24 jam setiap hari</li>
                            <li>Konsultasi apoteker: 24 jam</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Jl. Raya Darmo No. 120, Surabaya</li>
                            <li>WA: 0813-3456-7890</li>
                            <li>Telp: (031) 567-8899</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-blue-900 py-4 text-center text-xs">© 2026 Apotek Farma 24, Surabaya. Seluruh produk asli dan ber-BPOM.</div>
            </footer>

            <StickyMobileCta
                variant="whatsapp"
                title="Apotek Farma 24"
                subtitle="Buka 24 jam • antar 30–60 menit"
                actionLabel="Pesan Obat"
            />
        </div>
    );
}
