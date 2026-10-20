// ==========================================
// ROAMWISE MLBB — INTERACTIVE ENGINE
// Database Hero Tank, Simulasi Radar, Draft Assistant
// ==========================================

// Web Audio API Synthesizer (No external assets required)
class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem("roamwise_sfx") !== "false";
    }

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    }

    playTone(freq, type = "sine", duration = 0.1, gainVal = 0.05) {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === "suspended") {
                this.ctx.resume();
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context silently handled
        }
    }

    radarPing() {
        this.playTone(880, "sine", 0.12, 0.04);
        setTimeout(() => this.playTone(1760, "sine", 0.18, 0.03), 60);
    }

    click() {
        this.playTone(420, "triangle", 0.06, 0.03);
    }

    success() {
        this.playTone(523.25, "sine", 0.1, 0.04);
        setTimeout(() => this.playTone(659.25, "sine", 0.12, 0.04), 80);
        setTimeout(() => this.playTone(783.99, "sine", 0.22, 0.05), 160);
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem("roamwise_sfx", String(this.enabled));
        return this.enabled;
    }
}

const sfx = new SoundFX();

// ==========================================
// 1. DATABASE 20 HERO TANK & ROAMER MLBB
// ==========================================
const HEROES_DATA = [
    {
        id: "tigreal",
        name: "Tigreal",
        title: "The Warrior of Dawn",
        image: "assets/heroes/tigreal.png",
        role: "Tank",
        subrole: "inisiator",
        subroleLabel: "Inisiator & CC",
        difficulty: 1,
        specialty: ["Mass Setter", "Crowd Control", "AoE Stun"],
        winCondition: "Kunci 3-5 musuh dengan Implosion lalu dorong mereka ke arah damage dealer tim.",
        pros: [
            "Crowd control area luas dan beruntun (Push, Pull, Stun, Knockup)",
            "Pasif Fearless menahan 1 serangan basic attack setiap 4 stack",
            "Sangat mematikan saat dipadukan dengan Flicker mendadak"
        ],
        cons: [
            "Skill Implosion (Ultimate) bisa dibatalkan jika terkena CC musuh sebelum meletup",
            "Mobilitas rendah saat skill dash (S2) sedang cooldown",
            "Kurang efektif jika rekan satu tim tidak punya damage area"
        ],
        build: [
            { name: "Tough Boots (Conceal)", desc: "Kurangi durasi CC + aktifkan Conceal untuk inisiasi kejutan" },
            { name: "Dominance Ice", desc: "Potong regen musuh & turunkan attack speed marksman lawan" },
            { name: "Athena's Shield", desc: "Menahan burst damage dari mage lawan saat membuka war" },
            { name: "Antique Cuirass", desc: "Reduksi physical attack assassin lawan yang menyerang tim" },
            { name: "Immortality", desc: "Kesempatan hidup kembali untuk reset posisi atau zoning ulang" },
            { name: "Guardian Helmet", desc: "Regen HP deras agar bisa terus standby di garis depan" }
        ],
        spell: "Flicker",
        roamBlessing: "Conceal",
        combo: ["S2 (Dash Dorong)", "Flicker ke Belakang Musuh", "Ultimate (Implosion)", "S2 Fase 2 (Airborne)"],
        synergy: ["Pharsa", "Odette", "Aurora", "Claude", "Beatrix"],
        counters: ["Diggie (Time Journey)", "Valir", "Wanwan", "Akai"],
        proTip: "Tahan ultimate-mu sampai musuh menghabiskan skill blink/dash atau Purify mereka. Selalu gunakan Conceal sebelum menembus semak-semak!"
    },
    {
        id: "khufra",
        name: "Khufra",
        title: "Desert Tyrant",
        image: "assets/heroes/khufra.png",
        role: "Tank",
        subrole: "inisiator",
        subroleLabel: "Inisiator & Anti-Dash",
        difficulty: 2,
        specialty: ["Anti-Mobility", "Wall Slam", "Long Range Dive"],
        winCondition: "Batalkan dash assassin lincah musuh dengan bola pantul dan banting mereka ke tembok.",
        pros: [
            "Counter mutlak assassin ber-dash tinggi seperti Fanny, Ling, Joy, Harith",
            "Jangkauan inisiasi Skill 1 (Tyrant's Revenge) sangat jauh dari luar layar",
            "Ultimate Tyrant's Rage memberikan stun lama jika menabrak dinding"
        ],
        cons: [
            "Membutuhkan presisi sudut saat membanting musuh ke tembok",
            "Bouncing Ball (S2) bisa digagalkan oleh efek airborne atau knockback",
            "Mudah di-kiting oleh marksman berjangkauan jauh seperti Lesley atau Brody"
        ],
        build: [
            { name: "Tough Boots (Conceal)", desc: "Ketahanan CC tinggi + kamuflase inisiasi mendadak" },
            { name: "Dominance Ice", desc: "Mematikan lifesteal assassin dan attack speed lawan" },
            { name: "Radiant Armor / Athena", desc: "Menahan magic damage cicil atau burst" },
            { name: "Antique Cuirass", desc: "Redam skill physical beruntun dari assassin" },
            { name: "Immortality", desc: "Nyawa kedua untuk menyerap cooldown lawan" },
            { name: "Blade Armor", desc: "Pantulkan damage marksman musuh ke diri mereka sendiri" }
        ],
        spell: "Flicker",
        roamBlessing: "Conceal",
        combo: ["Charge S1 (Lompat)", "Flicker Tambah Jangkauan", "Ultimate (Banting ke Tembok)", "S2 (Bouncing Ball)"],
        synergy: ["Lancelot", "Hayabusa", "Claude", "Kadita", "Luo Yi"],
        counters: ["Martis", "Akai (Putaran batalkan bola)", "Diggie", "Karrie"],
        proTip: "Jangan panik saat melawan Fanny atau Ling. Simpan S2 (Bola Pantul) tepat di titik mendarat kabel atau pedang mereka!"
    },
    {
        id: "atlas",
        name: "Atlas",
        title: "Ocean Gladiator",
        image: "assets/heroes/atlas.png",
        role: "Tank",
        subrole: "inisiator",
        subroleLabel: "Inisiator & Disruption",
        difficulty: 2,
        specialty: ["Mass Pull", "High Speed Gank", "Freeze Aura"],
        winCondition: "Tarik 4-5 musuh sekaligus dengan Fatal Links dan lemparkan ke arah kombo tim.",
        pros: [
            "Inisiasi tercepat berkat Skill 2 Perfect Match (keluar dari cangkang mecha)",
            "Pasif Frigid Breath mengurangi attack speed & movement speed musuh di sekitar",
            "Bisa membalikkan keadaan game yang tertinggal dalam 1 kali ultimate yang tepat"
        ],
        cons: [
            "Di-counter habis oleh Diggie (Time Journey menghapus rantai Fatal Links)",
            "Badan robot rentan diserang saat jiwa cumi keluar di Skill 2",
            "Cooldown ultimate relatif lama"
        ],
        build: [
            { name: "Tough Boots (Conceal)", desc: "Kecepatan rotasi gila dipadu Conceal" },
            { name: "Dominance Ice", desc: "Aura dingin pasif + debuff Dominance melumpuhkan musuh" },
            { name: "Athena's Shield", desc: "Perlindungan saat menyelam ke garis belakang musuh" },
            { name: "Antique Cuirass", desc: "Memperkuat armor dari serangan fisik" },
            { name: "Fleeting Time / Immortality", desc: "Reset cooldown ultimate saat dapat kill/assist" },
            { name: "Guardian Helmet", desc: "Sustain HP tanpa perlu pulang ke base" }
        ],
        spell: "Flicker",
        roamBlessing: "Conceal",
        combo: ["S2 (Eject Jiwa)", "Conceal + S1", "Flicker ke Tengah Musuh", "Ultimate (Fatal Links Banting)"],
        synergy: ["Kadita", "Luo Yi", "Claude", "Badang", "Pharsa"],
        counters: ["Diggie (Hard Counter)", "Valir", "Wanwan", "Purify Spell"],
        proTip: "Selalu intip apakah musuh membawa battle spell Purify. Pancing Purify mereka keluar terlebih dahulu sebelum melepas Fatal Links!"
    },
    {
        id: "franco",
        name: "Franco",
        title: "Frozen Warrior",
        image: "assets/heroes/franco.png",
        role: "Tank",
        subrole: "pick-off",
        subroleLabel: "Pick-Off & Suppress",
        difficulty: 2,
        specialty: ["Iron Hook", "Hard Suppress", "Invade Disruptor"],
        winCondition: "Tarik hero carry musuh dari kejauhan dan kuncinya dengan gigitan Suppress yang tak bisa di-Purify.",
        pros: [
            "Ultimate Bloody Hunt bertipe Suppress (tidak bisa dibatalkan oleh spell Purify)",
            "Mampu merusuh buff musuh di menit 00:30 dengan menarik monster keluar sarang",
            "Movement speed pasif tinggi saat tidak terkena damage"
        ],
        cons: [
            "Sangat bergantung pada akurasi lemparan Iron Hook",
            "Daya tahan tubuh tidak setebal tank setter murni (tidak punya pasif shield/armor)",
            "Kurang kontribusi dalam teamfight 5v5 terbuka jika hook meleset"
        ],
        build: [
            { name: "Rapid Boots (Conceal)", desc: "Movement speed tertinggi untuk posisi hook optimal" },
            { name: "Dominance Ice", desc: "Kurangi regen lawan yang ditarik" },
            { name: "Athena's Shield", desc: "Pertahanan terhadap burst mage saat maju" },
            { name: "Antique Cuirass", desc: "Ketahanan armor fisik" },
            { name: "Thunder Belt", desc: "Slow tambahan dan true damage pada basic attack" },
            { name: "Immortality", desc: "Jaminan selamat setelah melakukan pick-off berani" }
        ],
        spell: "Flicker",
        roamBlessing: "Conceal",
        combo: ["S1 (Iron Hook)", "Flicker Mundur (Tarik Lebih Jauh)", "Ultimate (Suppress)", "S2 (Slow)"],
        synergy: ["Saber", "Harley", "Beatrix", "Eudora", "Karrie"],
        counters: ["Grock (Kebal CC)", "Hylos", "Atlas", "Belerick"],
        proTip: "Di awal game, jalan ke semak buff biru/merah musuh. Hook buff mereka tepat saat darah monster tinggal sedikit untuk mereset HP creep dan bikin jungler musuh frustrasi!"
    },
    {
        id: "minotaur",
        name: "Minotaur",
        title: "Son of Minos",
        image: "assets/heroes/minotaur.png",
        role: "Tank",
        subrole: "inisiator",
        subroleLabel: "Inisiator & Healer",
        difficulty: 1,
        specialty: ["AoE Knockup", "Mass Heal", "Defense Shred"],
        winCondition: "Keluarkan Minoan Fury untuk knockup area 3 tahap sambil terus memulihkan HP rekan tim.",
        pros: [
            "Bisa memberikan heal area secara konsisten untuk sustain tim (S2)",
            "Pasif mengurangi defense musuh yang terkena crowd control",
            "Ultimate sekarang bisa langsung digunakan tanpa perlu mengumpulkan Rage manual"
        ],
        cons: [
            "Animasi ultimate memiliki jeda kecil sebelum hentakan kedua dan ketiga",
            "Jangkauan lompat Skill 1 relatif pendek tanpa bantuan Flicker",
            "Rentan terhadap true damage Karrie"
        ],
        build: [
            { name: "Tough Boots (Favor)", desc: "Favor memberikan heal ekstra saat mengaktifkan S2" },
            { name: "Dominance Ice", desc: "Anti-heal dan penurun attack speed lawan" },
            { name: "Oracle", desc: "Meningkatkan efek pemulihan HP Minotaur dan tim" },
            { name: "Radiant Armor", desc: "Penahan damage sihir berkelanjutan" },
            { name: "Antique Cuirass", desc: "Penahan physical damage dari assassin" },
            { name: "Immortality", desc: "Jaminan hidup kedua di teamfight panjang" }
        ],
        spell: "Flicker",
        roamBlessing: "Favor",
        combo: ["S1 (Lompat Knockup)", "Flicker Koreksi Posisi", "Ultimate (Minoan Fury 3 Hentakan)", "S2 (Heal Tim)"],
        synergy: ["Irithel", "Bruno", "Karrie", "Moskov", "Yve"],
        counters: ["Diggie", "Karrie (True damage)", "Valir", "Baxia"],
        proTip: "Skill 2 Minotaur tidak hanya memulihkan HP, tapi juga meningkatkan attack speed rekan tim selama beberapa detik. Gunakan sebelum marksman timmu memukul turret atau Lord!"
    },
    {
        id: "grock",
        name: "Grock",
        title: "Fortress Titan",
        image: "assets/heroes/grock.png",
        role: "Tank",
        subrole: "invader",
        subroleLabel: "Invader & High Damage",
        difficulty: 2,
        specialty: ["CC Immunity", "Early Invade", "Wall Trap"],
        winCondition: "Invasi jungle musuh dari detik ke-30 dan kunci musuh di celah sempit dengan tembok dan tabrakan.",
        pros: [
            "Kebal segala Crowd Control saat menempel di dinding sambil charge Skill 1",
            "Damage awal game sangat besar untuk ukuran hero roamer",
            "Skill 2 membuat tembok batu untuk menutup jalur kabur atau memisahkan formasi musuh"
        ],
        cons: [
            "Membutuhkan positioning dekat tembok agar pasif defense dan kebal CC aktif",
            "Ultimate (Wild Charge) butuh menabrak dinding agar menghasilkan stun maksimal",
            "Mudah dilelehkan oleh mage pembawa Glowing Wand dan slow berat"
        ],
        build: [
            { name: "Warrior Boots (Conceal)", desc: "Bonus physical defense tinggi saat invasi awal" },
            { name: "Blade of the Heptaseas", desc: "Opsional damage awal: satu pukulan S1 membunuh marksman" },
            { name: "Dominance Ice", desc: "Mengunci regen lawan yang diinvasi" },
            { name: "Antique Cuirass", desc: "Membuat Grock sangat keras terhadap physical skill" },
            { name: "Athena's Shield", desc: "Penahan magic burst lawan" },
            { name: "Immortality", desc: "Keamanan saat menyelam di bawah turret lawan" }
        ],
        spell: "Flicker",
        roamBlessing: "Conceal",
        combo: ["Tempel Tembok", "Charge S1 (Kebal CC)", "S2 (Kunci Jalur Musuh)", "Ultimate (Tabrak Tembok Stun)", "Lepas S1"],
        synergy: ["Fanny", "Lancelot", "Saber", "Beatrix", "Novaria"],
        counters: ["Valir", "Lunox", "Karrie", "Diggie"],
        proTip: "Saat rotasi di sungai, selalu berjalan menempel tembok tebing. Grock mendapat bonus Movement Speed dan Physical/Magic Defense masif saat berada di dekat dinding!"
    },
    {
        id: "lolita",
        name: "Lolita",
        title: "Steel Elf",
        image: "assets/heroes/lolita.png",
        role: "Tank",
        subrole: "protector",
        subroleLabel: "Protector & Projectile Reflector",
        difficulty: 2,
        specialty: ["Projectile Reflect", "Single Stun", "Area Stun Cone"],
        winCondition: "Bentangkan perisai untuk memantulkan semua proyektil mematikan lawan kembali ke wajah mereka.",
        pros: [
            "Skill 2 sekarang MEMANTULKAN tembakan proyektil lawan (Chang'e, Lesley, Harley, dsb)",
            "Pasif otomatis memberikan shield gratis berkala untuk rekan tim di sekitar",
            "Ultimate Noumenon Energy Core memberikan stun area kipas yang sangat luas"
        ],
        cons: [
            "Charge ultimate bisa dibatalkan jika Lolita terkena stun atau knockup",
            "Perisai S2 hanya memblokir proyektil garis lurus, tidak menahan serangan area di tanah",
            "Damage serangan pribadi tergolong rendah"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Ketahanan CC tinggi + buff damage seluruh tim" },
            { name: "Dominance Ice", desc: "Wajib melawan marksman dan sustain hero" },
            { name: "Athena's Shield", desc: "Penahan magic damage" },
            { name: "Antique Cuirass", desc: "Mereduksi serangan physical lawan" },
            { name: "Radiant Armor", desc: "Menahan sisa serangan magic beruntun" },
            { name: "Immortality", desc: "Garansi keselamatan di teamfight akhir" }
        ],
        spell: "Flicker",
        roamBlessing: "Encourage",
        combo: ["Charge Ulti dari Semak", "Flicker Saat Bar Ulti Penuh", "S1 (Dash Stun Carry Lawan)", "S2 (Buka Perisai Pantulan)"],
        synergy: ["Chang'e (lawan)", "Layla", "Hanabi", "Bruno", "Irithel"],
        counters: ["Khufra (Batalkan charge)", "Akai", "Valir", "Martis"],
        proTip: "Selalu charge ultimate-mu dari dalam semak-semak! Garis area merah ulti Lolita TIDAK AKAN terlihat oleh musuh jika kamu berada di dalam semak yang tak punya vision musuh."
    },
    {
        id: "akai",
        name: "Akai",
        title: "Panda Warrior",
        image: "assets/heroes/akai.png",
        role: "Tank",
        subrole: "protector",
        subroleLabel: "Protector & Zone Disruptor",
        difficulty: 2,
        specialty: ["Heavy Spin", "Objective Pin", "Debuff Purge"],
        winCondition: "Putar Heavy Spin untuk menjepit carry musuh ke dinding atau menjauhkan jungler lawan dari Lord pit.",
        pros: [
            "Ultimate Heavy Spin langsung melepaskan semua efek slow/debuff dari tubuh Akai",
            "Raja pengontrol objektif Lord dan Turtle: mampu memental musuh keluar kontes Retri",
            "Pasif Taichi memberikan shield tebal setiap kali menggunakan skill"
        ],
        cons: [
            "Membutuhkan kelihaian mengarahkan putaran agar musuh tidak terpental ke tempat aman",
            "Rentan saat Heavy Spin selesai dan cooldown sedang berjalan",
            "Bisa sengaja atau tak sengaja menyelamatkan musuh jika putarannya salah arah"
        ],
        build: [
            { name: "Tough Boots (Conceal)", desc: "Conceal mempercepat laju mendekat sebelum putaran" },
            { name: "Dominance Ice", desc: "Penurun regen lawan yang dijepit" },
            { name: "Radiant Armor", desc: "Penahan magic damage saat memutar di tengah musuh" },
            { name: "Antique Cuirass", desc: "Mengurangi damage serangan fisik musuh" },
            { name: "Guardian Helmet", desc: "Sustain HP agar siap kontes Lord berikutnya" },
            { name: "Immortality", desc: "Nyawa cadangan saat zoning musuh di tower" }
        ],
        spell: "Petrify",
        roamBlessing: "Conceal",
        combo: ["S2 (Tandai Mark)", "S1 (Lompat Stun)", "Petrify (Kunci Gerak)", "Ultimate (Giring Musuh ke Tembok)"],
        synergy: ["Gusion", "Ling", "Karrie", "Pharsa", "Lancelot"],
        counters: ["Valir (Dorongan jauh)", "Karrie", "Diggie", "Wanwan"],
        proTip: "Saat tim sedang mengeksekusi Lord, jangan serang Lord-nya! Berdirilah di jalur masuk musuh, dan aktifkan Heavy Spin untuk menyapu jungler lawan sejauh mungkin dari Lord pit."
    },
    {
        id: "hylos",
        name: "Hylos",
        title: "Grand Warden",
        image: "assets/heroes/hylos.png",
        role: "Tank",
        subrole: "protector",
        subroleLabel: "Protector & Frontline Bully",
        difficulty: 1,
        specialty: ["Massive HP", "Mana Conversion", "Speed Pathway"],
        winCondition: "Gelar Glorious Pathway untuk percepat lari tim, lalu tempel carry lawan dengan aura cincin api.",
        pros: [
            "Pool HP terbesar di MLBB: Mana diubah menjadi HP dan bisa pakai HP saat Mana habis",
            "Sangat ramah pemula, mekanik simpel namun luar biasa tebal",
            "Glorious Pathway (Ultimate) mempercepat lari tim dan memperlambat musuh secara drastis"
        ],
        cons: [
            "Hitbox tubuh sangat besar: makanan empuk bagi hero pembeli Demon Hunter Sword (DHS)",
            "Sangat lemah terhadap true damage berbasis persentase HP (Karrie & Claude)",
            "Tidak memiliki skill dash untuk melompati tembok"
        ],
        build: [
            { name: "Tough/Warrior Boots (Encourage)", desc: "Buff attack kawan sambil maju paling depan" },
            { name: "Dominance Ice", desc: "Mana + HP + anti-lifesteal + slow attack speed musuh" },
            { name: "Clock of Destiny", desc: "Memberi Mana masif yang diubah menjadi ribuan bonus HP" },
            { name: "Radiant Armor", desc: "Penahan magic damage berkelanjutan" },
            { name: "Antique Cuirass / Blade Armor", desc: "Tergantung tipe marksman musuh" },
            { name: "Immortality", desc: "Jaminan hidup kedua untuk kembali bertarung" }
        ],
        spell: "Revitalize",
        roamBlessing: "Encourage",
        combo: ["Ultimate (Gelar Jalur Karpet)", "Nyalakan S2 (Ring Api)", "Dekati Carry", "S1 (Stun Kepala)", "Revitalize / Vengeance"],
        synergy: ["Karrie", "Roger", "Martis", "Irithel", "Moskov"],
        counters: ["Karrie (Hard Counter)", "Claude (DHS)", "Lunox", "Valir"],
        proTip: "Di level 1, Hylos adalah raja duel. Ambil Skill 2, berjalan ke arah semak sungai, dan tempel mage/roamer musuh tanpa takut kehabisan mana karena darah Hylos sangat tebal!"
    },
    {
        id: "baxia",
        name: "Baxia",
        title: "Mystic Tortoise",
        image: "assets/heroes/baxia.png",
        role: "Tank",
        subrole: "invader",
        subroleLabel: "Invader & Anti-Regen",
        difficulty: 2,
        specialty: ["Built-in Anti-Heal", "Fast Rolling", "Damage Reduction"],
        winCondition: "Gulingkan roda ke lane musuh, pasang jalur lava, dan matikan pemulihan HP musuh dengan pasif.",
        pros: [
            "Pasif alami memotong efek pemulihan HP / lifesteal musuh hingga 50%",
            "Rotasi super kilat berkat Skill 1 Baxia-Shield Unity yang bisa melompati rintangan",
            "Skill 2 Shield of Spirit me-reset cooldown jika mengenai hero lawan atau creep"
        ],
        cons: [
            "Tidak memiliki Crowd Control keras bertipe area luas (kebanyakan single target stun)",
            "Rentan terkena kiting oleh hero ber-movement speed tinggi",
            "Harus mengenai skill 2 secara akurat agar cooldown-nya ter-refresh"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Anti-CC + percepat rotasi berguling" },
            { name: "Dominance Ice", desc: "Kombo pasif Baxia + Dominance membuat lifesteal lawan 0%" },
            { name: "Glowing Wand / Radiant Armor", desc: "Efek bakar magic atau armor pertahanan" },
            { name: "Antique Cuirass", desc: "Pertahanan terhadap skill fisik" },
            { name: "Blade Armor", desc: "Pantulan damage terhadap marksman lawan" },
            { name: "Immortality", desc: "Ketahanan akhir game" }
        ],
        spell: "Vengeance",
        roamBlessing: "Encourage",
        combo: ["S1 (Roda Berguling Cepat)", "Tabrak Target Stun", "Ultimate (Lava Track)", "Spam S2 Terus Menerus", "Vengeance"],
        synergy: ["Lawan healer (Estes, Floryn, Ruby, Yu Zhong)", "Balerick", "Claude"],
        counters: ["Karrie", "X.Borg", "Valir", "Slow berat"],
        proTip: "Jika draft lawan memilih Estes, Rafaela, Floryn, atau Ruby, langsung amankan Baxia! Pasif bawaan Baxia memotong separuh heal mereka sejak detik pertama match tanpa perlu beli item."
    },
    {
        id: "belerick",
        name: "Belerick",
        title: "Guard of Nature",
        image: "assets/heroes/belerick.png",
        role: "Tank",
        subrole: "protector",
        subroleLabel: "Protector & Attack-Speed Counter",
        difficulty: 1,
        specialty: ["Damage Reflection", "Taunt CC", "HP Scaling"],
        winCondition: "Paksa musuh memukulmu dengan Taunt, lalu biarkan duri pasif dan Blade Armor membunuh mereka.",
        pros: [
            "Mimpi buruk terbesar bagi Marksman Attack Speed (Claude, Miya, Moskov, Wanwan)",
            "Pasif Deadly Thorns memantulkan damage magic setiap kali terkena serangan",
            "Mendapat bonus tambahan HP 30% dari semua item equipment yang dibeli"
        ],
        cons: [
            "Sangat rentan terhadap hero burst magic jarak jauh (Pharsa, Xavier, Novaria)",
            "Mobilitas tergolong lambat dan tidak punya skill melompati tembok",
            "Skill 1 (Akar) memiliki delay sebelum mengikat lawan"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Ketahanan CC tinggi" },
            { name: "Blade Armor", desc: "Sinergi mutlak dengan pasif pantulan duri Belerick" },
            { name: "Dominance Ice", desc: "Turunkan attack speed lawan lebih parah lagi" },
            { name: "Radiant Armor", desc: "Penahan magic damage berkelanjutan" },
            { name: "Antique Cuirass", desc: "Pengurangan serangan fisik" },
            { name: "Guardian Helmet", desc: "Sustain HP monster untuk Belerick" }
        ],
        spell: "Vengeance",
        roamBlessing: "Encourage",
        combo: ["S2 (Lari Cepat)", "Ultimate (Wrath of Dryad Taunt)", "Vengeance Aktif", "S1 (Ikat Akar Musuh)"],
        synergy: ["Hero scaling late game", "Claude (lawan)", "Miya (lawan)", "Moskov (lawan)"],
        counters: ["Pharsa", "Xavier", "Valir", "Karrie"],
        proTip: "Saat war dimulai, jangan kabur dari tembakan marksman musuh! Nyalakan battle spell Vengeance, gunakan Ultimate untuk memaksa musuh memukulmu, dan lihat darah musuh habis sendiri."
    },
    {
        id: "gatotkaca",
        name: "Gatotkaca",
        title: "Iron Fist of Dawn",
        image: "assets/heroes/gatotkaca.png",
        role: "Tank",
        subrole: "inisiator",
        subroleLabel: "Inisiator & Physical Wall",
        difficulty: 1,
        specialty: ["Armor Conversion", "Long Range Dive", "Counter Punch"],
        winCondition: "Lompat dari kejauhan dengan Avatar of the Guardian dan balas pukulan musuh dengan tinju baja.",
        pros: [
            "Pasif Steel Bones mengubah HP yang hilang menjadi Physical Defense raksasa",
            "Jangkauan lompat Ultimate sangat jauh, cocok untuk inisiasi dari tempat tak terduga",
            "Skill 2 Unbreakable memaksa musuh melakukan taunt menyerang Gatot"
        ],
        cons: [
            "Lompatan ultimate memiliki indikator lingkaran tanah yang bisa dihindari lawan dengan blink",
            "Pertahanan terhadap magic damage tidak sebesar pertahanan fisik alaminya",
            "Mudah di-kiting jika skill taunt meleset"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Menutup kelemahan magic defense & kurangi durasi CC" },
            { name: "Dominance Ice", desc: "Anti-heal dan penambah armor" },
            { name: "Radiant Armor / Athena", desc: "Wajib untuk menahan magic damage lawan" },
            { name: "Blade Armor", desc: "Sinergi taunt S2 untuk memantulkan damage" },
            { name: "Oracle", desc: "Meningkatkan lifesteal dari tinju pasif Gatot" },
            { name: "Immortality", desc: "Kesempatan hidup kedua saat war sengit" }
        ],
        spell: "Vengeance",
        roamBlessing: "Encourage",
        combo: ["Ultimate (Lompat dari Jauh)", "S2 (Charge Taunt Musuh)", "Vengeance", "Pukul Basic Attack Pasif Tinju"],
        synergy: ["Pharsa", "Yve", "Beatrix", "Saber", "Karrie"],
        counters: ["Lunox", "Karrie", "Diggie", "Valir"],
        proTip: "Semakin sekarat darah Gatotkaca, semakin keras tinjunya dan semakin tinggi armornya! Jangan panik saat darahmu tipis; lepaskan basic attack pasif saat bar merah penuh untuk pulihkan HP masif."
    },
    {
        id: "johnson",
        name: "Johnson",
        title: "Mustang Crusher",
        image: "assets/heroes/johnson.png",
        role: "Tank",
        subrole: "inisiator",
        subroleLabel: "Inisiator & Pick-Off Driver",
        difficulty: 2,
        specialty: ["Global Driving", "Crash Stun", "Passenger Combo"],
        winCondition: "Bawa mage atau carry tim di dalam mobil, tabrak hero kunci lawan, dan ratakan dengan kombo maut.",
        pros: [
            "Mobilitas global: bisa menjangkau lane manapun di peta dalam hitungan detik",
            "Kombo mobil dengan mage burst seperti Kadita atau Odette nyaris tak terbendung",
            "Pasif Electro-airbag memberikan perisai tebal darurat saat HP di bawah 30%"
        ],
        cons: [
            "Membutuhkan keahlian menyetir mobil agar tidak menabrak rintangan tembok",
            "Grock bisa membuat tembok S2 mendadak untuk membatalkan mobil Johnson",
            "Jika tabrakan meleset, Johnson dan penumpangnya rentan terkepung musuh"
        ],
        build: [
            { name: "Warrior Boots (Dire Hit)", desc: "Dire hit menambah damage letupan tabrakan mobil" },
            { name: "Fleeting Time", desc: "Mempercepat cooldown mobil setiap kali assist/kill" },
            { name: "Dominance Ice", desc: "Pertahanan fisik dan debuff lifesteal" },
            { name: "Blade Armor", desc: "Meningkatkan pasif shield dan memantulkan damage" },
            { name: "Athena's Shield", desc: "Perlindungan magic burst" },
            { name: "Immortality", desc: "Menjamin keselamatan saat menyelam ke dalam markas musuh" }
        ],
        spell: "Petrify",
        roamBlessing: "Dire Hit",
        combo: ["Ultimate (Nyetir Mobil Bawa Teman)", "Tabrak Target Kunci", "Petrify (Kunci Ditempat)", "S2 (Area Elektrik)", "S1 (Lempar Kunci)"],
        synergy: ["Kadita", "Odette", "Badang", "Claude", "Aurora"],
        counters: ["Grock (Tembok halangi mobil)", "Belerick", "Diggie", "Martis"],
        proTip: "Hafalkan belokan-belokan sempit di area hutan (jungle). Selalu aktifkan sinyal suara atau ping ajak teman naik mobil sebelum mulai melaju menyeberang sungai!"
    },
    {
        id: "edith",
        name: "Edith",
        title: "Forsaken Warden",
        image: "assets/heroes/edith.png",
        role: "Tank",
        subrole: "flex",
        subroleLabel: "Flex & Hybrid Marksman",
        difficulty: 2,
        specialty: ["Dual Form", "Airborne CC", "Magic Burst"],
        winCondition: "Kumpulkan Wrath bar dengan menerima damage di mode robot, lalu keluar tembakkan petir mematikan.",
        pros: [
            "Mode Robot: sangat tebal dan memiliki Crowd Control beruntun (Flip ke belakang + Knockup)",
            "Mode Ultimate: berubah menjadi Marksman penembak petir dengan magic damage gila",
            "Item defense yang dibeli dikonversi otomatis menjadi Magic Power saat dalam mode marksman"
        ],
        cons: [
            "Darah di mode marksman jauh lebih rapuh jika Wrath bar belum maksimal",
            "Skill 2 (Flip) bisa meleset jika musuh menjaga jarak",
            "Memerlukan perhitungan kapan waktu tepat untuk keluar dari robot"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Ketahanan CC tinggi" },
            { name: "Dominance Ice", desc: "Pertahanan fisik + mana + anti heal" },
            { name: "Athena's Shield", desc: "Menambah magic defense yang akan diubah jadi magic power" },
            { name: "Antique Cuirass", desc: "Meningkatkan ketahanan terhadap assassin" },
            { name: "Feather of Heaven / Holy Crystal", desc: "Opsional damage tembakan petir makin pedas" },
            { name: "Immortality", desc: "Jaminan hidup kedua di fase late game" }
        ],
        spell: "Flicker",
        roamBlessing: "Encourage",
        combo: ["S2 (Lompat Lempar Musuh ke Belakang)", "S1 (Hentakan Tanah Knockup)", "Tunggu Wrath Penuh", "Ultimate (Keluar Tembak Petir)"],
        synergy: ["Tim yang kekurangan magic damage di late game", "Beatrix", "Karrie"],
        counters: ["Karrie (True damage lelehkan robot)", "Wanwan", "Valir"],
        proTip: "Semua poin Physical & Magic Defense yang kamu beli di item tank akan dikonversi menjadi Magic Power saat mengaktifkan Ultimate Primal Wrath. Bangun build full tank, damagemu tetap sakit!"
    },
    {
        id: "chip",
        name: "Chip",
        title: "Phase Commander",
        image: "assets/heroes/chip.png",
        role: "Tank",
        subrole: "flex",
        subroleLabel: "Flex & Global Teleport",
        difficulty: 2,
        specialty: ["Global Portal", "Fast Gank", "Snack Healing"],
        winCondition: "Buka portal teleportasi Shortcut di dekat musuh sendirian agar seluruh tim bisa datang seketika.",
        pros: [
            "Mampu memindahkan seluruh rekan tim dari seberang map langsung ke medan pertempuran",
            "Punya 4 beacon khusus di sudut-sudut peta untuk rotasi instan",
            "Pasif memakan keripik memulihkan HP secara deras saat keluar dari combat"
        ],
        cons: [
            "Membutuhkan komunikasi tim yang solid agar teman segera mengklik tombol masuk portal",
            "Musuh juga bisa masuk ke portal jika tidak diantisipasi dengan baik",
            "Hitbox tabrakan S2 membutuhkan jalur lurus tanpa terhalang minion"
        ],
        build: [
            { name: "Tough Boots (Conceal)", desc: "Conceal mempermudah mendekat sebelum portal dibuka" },
            { name: "Dominance Ice", desc: "Menutup regenerasi lawan" },
            { name: "Athena's Shield", desc: "Penahan magic burst" },
            { name: "Antique Cuirass", desc: "Pertahanan fisik terhadap skill musuh" },
            { name: "Thunder Belt", desc: "Slow area dan true damage" },
            { name: "Immortality", desc: "Pertahanan pamungkas" }
        ],
        spell: "Flicker",
        roamBlessing: "Conceal",
        combo: ["S2 (Lari Tabrak Target)", "S1 (Ledakan Chip)", "Ultimate (Buka Portal Shortcut Panggil Tim)", "Flicker"],
        synergy: ["Hero dengan burst cepat", "Terizla", "Pharsa", "Claude", "Guinevere"],
        counters: ["Hero AoE yang menunggu di pintu portal (Pharsa, Yve, Xavier)", "Diggie"],
        proTip: "Manfaatkan 4 beacon portal di sudut map untuk ganking ke Gold Lane di menit awal lalu kembali ke Mid dalam 2 detik saja!"
    },
    {
        id: "fredrinn",
        name: "Fredrinn",
        title: "Rogue Appraiser",
        image: "assets/heroes/fredrinn.png",
        role: "Tank",
        subrole: "flex",
        subroleLabel: "Flex & Sustain Counter",
        difficulty: 2,
        specialty: ["Crystal Energy", "AoE Taunt", "Nuclear Counter"],
        winCondition: "Biarkan HP berkurang jadi Crystal Energy abu-abu, lalu tebas musuh dengan Appraiser's Wrath bernilai puluhan ribu damage.",
        pros: [
            "Pertahanan HP tebal dan bisa mengubah damage yang diterima menjadi lifesteal kembali",
            "Memiliki taunt area (Skill 3) yang memaksa musuh menghentikan kombo mereka",
            "Damage ultimate luar biasa besar, setara dengan jumlah darah abu-abu yang hilang"
        ],
        cons: [
            "Mobilitas tergolong sedang, skill dash S2 memiliki jangkauan pendek",
            "Darah abu-abu (Crystal Energy) akan memudar perlahan jika tidak menyerang lawan",
            "Rentan terhadap efek anti-heal berat dan kiting hero berjangkauan jauh"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Pengurang durasi CC musuh" },
            { name: "Cursed Helmet / Dominance Ice", desc: "Bakar HP musuh & debuff regen lawan" },
            { name: "Radiant Armor", desc: "Penahan magic damage beruntun" },
            { name: "Antique Cuirass", desc: "Mereduksi serangan fisik lawan" },
            { name: "Guardian Helmet", desc: "Meningkatkan max HP untuk memperbesar damage ulti" },
            { name: "Immortality", desc: "Nyawa cadangan di teamfight late game" }
        ],
        spell: "Vengeance",
        roamBlessing: "Encourage",
        combo: ["S1 (Tebas Pedang)", "S2 (Dash Knockup)", "S3 (Taunt Musuh)", "Tunggu Bar Abu-abu Penuh", "Ultimate (Tebasan Nuklir)"],
        synergy: ["Hero yang suka war lama", "Karrie", "Claude", "Faramis"],
        counters: ["Karrie (True damage)", "Baxia (Anti heal)", "Valir", "Lunox"],
        proTip: "Jangan takut saat darahmu berkurang menjadi bar abu-abu! Semakin panjang bar abu-abu (Crystal Energy) Fredrinn, semakin mengerikan damage tebasan Ultimate Appraiser's Wrath yang dilepaskannya!"
    },
    {
        id: "gloo",
        name: "Gloo",
        title: "Swamp Spirits",
        image: "assets/heroes/gloo.png",
        role: "Tank",
        subrole: "flex",
        subroleLabel: "Flex & Hostage Taker",
        difficulty: 2,
        specialty: ["Split Slime", "Attach to Enemy", "Damage Transfer"],
        winCondition: "Pecah jadi slime kecil, tempel stack pasif, lalu nempel di badan carry musuh dan seret mereka ke dalam turret.",
        pros: [
            "Saat nempel di badan lawan (Grab, Grab), sebagian besar damage yang diterima Gloo dialihkan ke lawan tersebut",
            "Regen HP deras saat membelah diri menjadi slime kecil",
            "Sangat mengganggu formasi musuh di choke point sempit"
        ],
        cons: [
            "Faramis, Vexana, dan Claude adalah counter mutlak karena mereka mendapat lifesteal/ledakan dari anak slime Gloo",
            "Butuh menumpuk 5 stack pasif sebelum bisa menempel di badan lawan",
            "Musuh bisa membeli spell Purify untuk melepaskan tempelan Gloo"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Ketahanan CC tinggi" },
            { name: "Dominance Ice", desc: "Menutup regenerasi hero yang ditempeli" },
            { name: "Radiant Armor", desc: "Penahan magic damage" },
            { name: "Antique Cuirass", desc: "Mengurangi physical attack lawan" },
            { name: "Guardian Helmet", desc: "Regen HP terus menerus" },
            { name: "Immortality", desc: "Jaminan hidup kedua" }
        ],
        spell: "Sprint",
        roamBlessing: "Encourage",
        combo: ["Pecah Ulti (Split)", "Kumpulkan 5 Stack Pasif", "Ultimate Fase 2 (Nempel di Badan Lawan)", "Seret Masuk Turret"],
        synergy: ["Tim dengan burst follow up", "Beatrix", "Yve", "Lancelot"],
        counters: ["Faramis (Hard Counter)", "Vexana", "Claude", "Purify Spell"],
        proTip: "Hati-hati jika musuh memilih Faramis atau Vexana! Anak-anak slime kecil Gloo dihitung sebagai unit terpisah yang bisa meledakkan timmu sendiri jika terkena skill pasif mereka."
    },
    {
        id: "uranus",
        name: "Uranus",
        title: "Aethereal Defender",
        image: "assets/heroes/uranus.png",
        role: "Tank",
        subrole: "invader",
        subroleLabel: "Invader & Pure Sustain",
        difficulty: 1,
        specialty: ["Infinite Regen", "Tower Dive", "Skill Baiter"],
        winCondition: "Jaga 20 stack Radiance tetap menyala, serap semua skill musuh, dan potong jalur minion di belakang turret lawan.",
        pros: [
            "Regenerasi HP otomatis tanpa henti jika stack Radiance terus terjaga",
            "Ultimate Consecration langsung melepaskan efek slow dan memberi shield tebal",
            "Mampu melakukan tower dive dan membuang cooldown skill berharga lawan"
        ],
        cons: [
            "Tidak punya hard Crowd Control (tidak ada stun atau knockup untuk melindungi kawan)",
            "Sangat lumpuh jika lawan membeli item anti-heal (Sea Halberd, Glowing Wand, Dominance Ice)",
            "Bukan tank tipe inisiator setter 5v5"
        ],
        build: [
            { name: "Tough / Demon Shoes (Encourage)", desc: "Menjaga mana agar bisa terus spam S1" },
            { name: "Dominance Ice", desc: "Pertahanan fisik + anti heal" },
            { name: "Oracle", desc: "Meningkatkan regenerasi HP Uranus hingga 30%" },
            { name: "Radiant Armor", desc: "Menahan magic damage cicil" },
            { name: "Antique Cuirass", desc: "Mereduksi serangan fisik" },
            { name: "Immortality", desc: "Ketahanan maksimal di fase akhir" }
        ],
        spell: "Purify",
        roamBlessing: "Encourage",
        combo: ["Jaga Stack Radiance 20", "Spam S1 (Energi Putar)", "S2 (Lompat Beri Shield)", "Ultimate (Saat Terkena Slow)"],
        synergy: ["Tim yang punya inisiator di EXP lane", "Terizla", "Arlott", "Ruby"],
        counters: ["Baxia (Pasif anti-regen)", "Sea Halberd", "Glowing Wand", "Karrie"],
        proTip: "Tugas Uranus bukan inisiasi war, melainkan memotong minion di belakang turret lawan (cut lane) dan memancing musuh membuang skill pamungkas mereka ke tubuh Uranus yang terus beregenerasi!"
    },
    {
        id: "barats",
        name: "Barats",
        title: "Dino Rider",
        image: "assets/heroes/barats.png",
        role: "Tank",
        subrole: "invader",
        subroleLabel: "Invader & Giant Frontline",
        difficulty: 2,
        specialty: ["Big Body Size", "Massive Defense", "Devour CC"],
        winCondition: "Pertahankan 16 stack Big Guy agar ukuran tubuh raksasa, lalu telan carry musuh dan muntahkan ke dinding.",
        pros: [
            "Setiap stack Big Guy menambah Physical/Magic Defense serta Resilience (pengurangan durasi CC)",
            "Ukuran tubuh yang membesar membuat musuh kesulitan menembak carry di belakang Barats",
            "Ultimate Detona's Welcome menelan musuh dan kebal CC saat sedang mengunyah"
        ],
        cons: [
            "Stack Big Guy akan berkurang jika tidak memukul target dalam waktu tertentu",
            "Hitbox yang sangat besar menjadikannya sasaran empuk hero true damage seperti Karrie",
            "Mobilitas berkurang saat berada dalam ukuran raksasa"
        ],
        build: [
            { name: "Tough Boots (Encourage)", desc: "Resilience bawaan stack + Tough Boots membuat Barats nyaris kebal CC" },
            { name: "Guardian Helmet", desc: "Regen HP deras untuk badan raksasa" },
            { name: "Dominance Ice", desc: "Anti-heal dan penurun attack speed" },
            { name: "Radiant Armor", desc: "Penahan serangan magic beruntun" },
            { name: "Antique Cuirass", desc: "Pertahanan terhadap skill fisik" },
            { name: "Immortality", desc: "Jaminan keselamatan akhir match" }
        ],
        spell: "Vengeance",
        roamBlessing: "Encourage",
        combo: ["Jaga Stack 16 Penuh", "S1 (Minyak & Bakar)", "S2 (Rudal Dorong Lawan)", "Ultimate (Telan Musuh lalu Semburkan ke Dinding)"],
        synergy: ["Hero zoning objektif", "Yve", "Claude", "Pharsa", "Lancelot"],
        counters: ["Karrie (Hard Counter)", "Claude (DHS)", "Valir", "Lunox"],
        proTip: "Selalu pukul minion, jungle, atau monster kelomang di sungai saat berjalan agar stack Big Guy tetap berada di angka 16. Saat stack 16, Barats mendapatkan hingga ratusan bonus defense gratis!"
    },
    {
        id: "mathilda",
        name: "Mathilda",
        title: "Swift Plume",
        image: "assets/heroes/mathilda.png",
        role: "Support",
        subrole: "protector",
        subroleLabel: "Protector & Free Taxi",
        difficulty: 2,
        specialty: ["Guiding Wind Taxi", "Flying Ultimate", "Burst Magic"],
        winCondition: "Gunakan Guiding Wind untuk memberi shield dan menjemput carry tim yang terancam ganking lawan.",
        pros: [
            "Skill 2 Guiding Wind memberikan shield tebal dan tombol lompat terbang gratis bagi seluruh kawan",
            "Ultimate Circling Eagle mengunci lawan, terbang melingkar di atasnya, dan menabrak dengan stun",
            "Damage magic Skill 1 di awal game sangat sakit untuk mencicil hero lawan"
        ],
        cons: [
            "Tidak setebal tank konvensional jika terkena burst damage mendadak",
            "Skill 2 bisa dibatalkan oleh bola pantul Khufra atau jebakan Minsitthar",
            "Membutuhkan kawan yang peka untuk memencet tombol skill taxi yang muncul"
        ],
        build: [
            { name: "Tough Boots (Favor)", desc: "Favor memberikan heal ekstra saat mengaktifkan S2" },
            { name: "Flask of the Oasis", desc: "Item wajib: memberi shield darurat saat HP rekan sekarat" },
            { name: "Dominance Ice", desc: "Anti-heal dan penambah armor" },
            { name: "Athena's Shield", desc: "Penahan magic burst" },
            { name: "Antique Cuirass", desc: "Pertahanan fisik" },
            { name: "Immortality", desc: "Keamanan saat terbang di tengah musuh" }
        ],
        spell: "Flicker",
        roamBlessing: "Favor",
        combo: ["Charge S1 (Kumpulkan Gumpalan Roh)", "S2 (Beri Link Terbang Teman)", "Ultimate (Kunci Target & Putar Terbang)", "Tabrak Stun"],
        synergy: ["Layla", "Hanabi", "Odette", "Xavier", "Claude"],
        counters: ["Khufra (Batalkan dash)", "Minsitthar", "Phoveus", "Franco (Suppress)"],
        proTip: "Guiding Wind (Skill 2) bukan cuma untuk kabur! Gunakan S2 ke arah musuh agar marksman atau fighter timmu bisa terbang maju mengejar musuh yang sedang sekarat."
    }
];

// ==========================================
// 2. RADAR & MINIMAP SIMULATOR DATA
// ==========================================
const RADAR_PHASES = {
    early: {
        tag: "FASE 1 / 04 (00:00 - 01:15)",
        title: "Early Game: Clear Mid & Cek Buff Jungler Lawan",
        risk: "low",
        riskText: "RISIKO: RENDAH",
        desc: "Bantu mage bersihkan gelombang minion pertama dalam 10 detik. Jangan ambil minion! Langsung intip apakah jungler lawan mulai dari buff merah atau biru. Beri ping arah rotasi ke Gold Lane.",
        roamerPos: { top: "45%", left: "44%" },
        routes: { r1: true, r2: false }
    },
    turtle: {
        tag: "FASE 2 / 04 (01:45 - 03:00)",
        title: "Setup Turtle 1: Kuasai Semak & Lindungi Retri",
        risk: "high",
        riskText: "RISIKO: TINGGI",
        desc: "Hadir di semak Turtle 15 detik sebelum spawn. Usir jungler lawan saat mencoba mendekati pit. Jangan serang Turtle sendirian; tugasmu adalah zoning dan pasang badan!",
        roamerPos: { top: "72%", left: "27%" },
        routes: { r1: false, r2: true }
    },
    mid: {
        tag: "FASE 3 / 04 (04:00 - 09:00)",
        title: "Mid Game: Gank Gold Lane & Kontrol Sungai",
        risk: "medium",
        riskText: "RISIKO: SEDANG",
        desc: "Lakukan ganking kejutan ke Gold Lane bersama mage. Amankan outer turret pertama. Curi monster jungle kecil milik lawan saat formasi mereka terpencar.",
        roamerPos: { top: "24%", left: "75%" },
        routes: { r1: true, r2: true }
    },
    late: {
        tag: "FASE 4 / 04 (10:00+)",
        title: "Late Game: Kontrol Lord Pit & Peeling Carry",
        risk: "extreme",
        riskText: "RISIKO: MAKSIMAL",
        desc: "Satu kesalahan posisi berujung kekalahan! Jangan masuk semak sendirian tanpa kawan. Simpan Flicker dan Ultimate untuk mengunci carry lawan atau mematikan inisiasi musuh.",
        roamerPos: { top: "35%", left: "32%" },
        routes: { r1: true, r2: true }
    }
};

const NODE_INTEL = {
    gold: {
        title: "Area Gold Lane (Marksman Priority)",
        risk: "medium",
        riskText: "PRIORITAS: TINGGI",
        desc: "Sarang marksman tim dan lawan. Sebelum menit ke-5, berikan proteksi saat marksman lawan mulai menekan tower. Setelah menit ke-5, buka semak sungai dekat turret."
    },
    mid: {
        tag: "PIVOT PETA",
        title: "Area Mid Lane & Lithowanderer",
        risk: "low",
        riskText: "PRIORITAS: RUTIN",
        desc: "Jantung rotasi Land of Dawn. Kuasai semak Mid untuk memberikan kebebasan rotasi bagi magemu ke lane atas maupun bawah."
    },
    turtle: {
        title: "Sarang Turtle (Menit 02:00 - 08:00)",
        risk: "high",
        riskText: "ZONA KONTES: KRUSIAL",
        desc: "Turtle memberi shield dan gold global untuk seluruh tim. Roamer wajib berada di semak depan pit untuk menghalau inisiasi musuh."
    },
    lord: {
        title: "Sarang Lord Evolved (Menit 10:00+)",
        risk: "extreme",
        riskText: "ZONA KEMATIAN: EKSTREM",
        desc: "Game-winning objective! Kuasai semak choke point. Pastikan jungler lawan tidak bisa melompat masuk untuk mencuri Retribution."
    },
    bush: {
        title: "Semak Sungai (River Ambush Bush)",
        risk: "high",
        riskText: "BAHAYA AMBUSH",
        desc: "Jangan buka semak dengan badan jika heromu tipis. Selalu gunakan skill area untuk memeriksa (bush check) sebelum berjalan melintas."
    },
    invade: {
        title: "Jungle Sisi Musuh (Buff Merah / Biru)",
        risk: "extreme",
        riskText: "ZONA INVASI AGGRO",
        desc: "Hanya masuki area ini jika kamu menggunakan tank tebal (Grock, Baxia, Hylos) dan posisi mage/jungler tim siap menyusul."
    }
};

// ==========================================
// 3. DRAFT ASSISTANT ENGINE DATA
// ==========================================
const DRAFT_SCENARIOS = {
    assassin: {
        badge: "⚡ COUNTER ASSASSIN DASH",
        threat: "Lawan Banyak Assassin Lincah (Fanny, Ling, Joy, Lancelot, Hayabusa)",
        heroes: ["khufra", "franco", "minotaur"],
        reason: "Khufra memiliki Bouncing Ball (S2) yang membatalkan seluruh skill dash assassin saat mereka melompat. Franco memiliki Bloody Hunt bertipe Suppress yang tak bisa di-Purify. Minotaur memberikan knockup beruntun yang menghentikan pergerakan lincah mereka.",
        spell: "Flicker (untuk repositioning seketika) atau Petrify",
        coreItem: "Antique Cuirass (Memotong physical attack musuh yang spam skill) & Dominance Ice"
    },
    attackspeed: {
        badge: "🏹 COUNTER MARKSMAN ATTACK-SPEED",
        threat: "Lawan Bertumpu pada Marksman Basic Attack (Claude, Miya, Moskov, Wanwan, Bruno)",
        heroes: ["belerick", "lolita", "gatotkaca"],
        reason: "Belerick memantulkan serangan bertubi-tubi dengan pasif Deadly Thorns (makin cepat musuh menembak, makin cepat mereka mati). Lolita membentangkan perisai yang memantulkan seluruh proyektil tembakan kembali ke lawan. Gatotkaca mengubah damage menjadi armor masif.",
        spell: "Vengeance (Memantulkan damage fisik dan mengurangi damage yang diterima)",
        coreItem: "Blade Armor (Sinergi mutlak pantulan damage) & Dominance Ice (Pangkas 70% attack speed lawan)"
    },
    magicburst: {
        badge: "🔮 COUNTER MAGIC BURST & POKE",
        threat: "Lawan Mengandalkan Mage Burst & Proyektil (Chang'e, Pharsa, Novaria, Xavier, Kadita)",
        heroes: ["lolita", "hylos", "atlas"],
        reason: "Lolita adalah mimpi buruk mutlak Chang'e dan Novaria karena tamengnya menelan seluruh hujan peluru magic mereka. Hylos memiliki pool HP raksasa yang tidak mudah meledak oleh burst, sementara Atlas bisa langsung melompat menembus formasi mage jarak jauh lawan.",
        spell: "Flicker (Menghindar atau menerobos formasi belakang) atau Revitalize",
        coreItem: "Athena's Shield (Menahan burst instan) & Radiant Armor (Menahan cicilan terus menerus)"
    },
    teamfight: {
        badge: "💥 5v5 TEAMFIGHT SETTER",
        threat: "Tim Butuh Inisiator War Area Luas (Kawan punya Pharsa, Odette, Aurora, Claude)",
        heroes: ["tigreal", "atlas", "minotaur"],
        reason: "Trio inisiator setter terbaik di MLBB! Implosion Tigreal, Fatal Links Atlas, dan Minoan Fury Minotaur mampu mengunci 3 hingga 5 hero lawan sekaligus dalam satu titik empuk bagi kombo mage dan marksman timmu.",
        spell: "Flicker (Wajib untuk kombo inisiasi kejutan tanpa aba-aba)",
        coreItem: "Conceal Boots (Mendekat tanpa terlihat di minimap) & Immortality"
    },
    invade: {
        badge: "🌲 AGGRO JUNGLE INVADE",
        threat: "Strategi Rusuh Jungle Musuh dari Menit Awal (Bikin Jungler Lawan Tertinggal)",
        heroes: ["grock", "baxia", "barats"],
        reason: "Grock kebal segala Crowd Control di dekat tembok dan punya damage awal gila. Baxia memiliki mobilitas roda kilat dan pasif anti-heal bawaan. Barats memiliki stack defense tebal yang tak terkalahkan saat duel menit pertama di sungai.",
        spell: "Execute / Vengeance / Sprint",
        coreItem: "Warrior Boots + Cursed Helmet / Blade of the Heptaseas"
    },
    regen: {
        badge: "🩸 ANTI-HEAL & SUSTAIN CRUSHER",
        threat: "Lawan Memiliki Healer atau Lifesteal Deras (Estes, Floryn, Rafaela, Ruby, Yu Zhong)",
        heroes: ["baxia", "belerick", "edith"],
        reason: "Pasif alami Baxia memotong regenerasi HP lawan hingga 50% sejak detik pertama match. Dipadukan dengan Dominance Ice, seluruh heal Estes atau lifesteal Ruby nyaris tidak berasa sama sekali!",
        spell: "Vengeance / Flicker",
        coreItem: "Dominance Ice (Wajib rush item pertama setelah sepatu) & Radiant Armor"
    }
};

// ==========================================
// 4. DOM ELEMENTS & STATE
// ==========================================
const heroRosterGrid = document.querySelector("#hero-roster-grid");
const heroSearchInput = document.querySelector("#hero-search");
const searchClearBtn = document.querySelector("#search-clear");
const filterPills = document.querySelectorAll(".filter-pill");
const diffSelect = document.querySelector("#diff-select");
const rosterResultCount = document.querySelector("#roster-result-count");
const heroModal = document.querySelector("#hero-modal");
const modalCloseBtn = document.querySelector("#modal-close-btn");
const modalInnerBody = document.querySelector("#modal-inner-body");
const soundToggleBtn = document.querySelector("#sound-toggle");
const backToTopBtn = document.querySelector("#back-to-top");
const siteMusic = document.querySelector("#site-music");
const musicPlayBtn = document.querySelector("#music-play-btn");
const musicPlayIcon = document.querySelector("#music-play-icon");
const musicStatus = document.querySelector("#music-status");
const musicVolumeBtn = document.querySelector("#music-volume-btn");
const musicVolumeIcon = document.querySelector("#music-volume-icon");
const musicVisualizer = document.querySelector("#music-visualizer");

// State
let activeSubrole = "all";
let activeDifficulty = "all";
let searchQuery = "";

// ==========================================
// 5. HERO ROSTER RENDER & FILTER FUNCTIONS
// ==========================================
function renderHeroCards() {
    if (!heroRosterGrid) return;

    const filtered = HEROES_DATA.filter((hero) => {
        // Subrole filter
        const matchesSubrole = activeSubrole === "all" || hero.subrole === activeSubrole;
        // Difficulty filter
        const matchesDiff = activeDifficulty === "all" || hero.difficulty === Number(activeDifficulty);
        // Search filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
            hero.name.toLowerCase().includes(q) ||
            hero.title.toLowerCase().includes(q) ||
            hero.subroleLabel.toLowerCase().includes(q) ||
            hero.specialty.some((s) => s.toLowerCase().includes(q)) ||
            hero.winCondition.toLowerCase().includes(q);

        return matchesSubrole && matchesDiff && matchesSearch;
    });

    if (rosterResultCount) {
        rosterResultCount.textContent = `Menampilkan ${filtered.length} dari ${HEROES_DATA.length} hero tank`;
    }

    if (filtered.length === 0) {
        heroRosterGrid.innerHTML = `
            <div class="roster-empty">
                <span class="empty-icon">🛡️</span>
                <h3>Hero Tidak Ditemukan</h3>
                <p>Tidak ada hero tank yang cocok dengan kata kunci "<strong>${escapeHtml(searchQuery)}</strong>". Coba kata kunci lain atau reset filter.</p>
                <button type="button" class="button button-primary" id="btn-reset-filter">Reset Filter</button>
            </div>
        `;
        const resetBtn = heroRosterGrid.querySelector("#btn-reset-filter");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                sfx.click();
                activeSubrole = "all";
                activeDifficulty = "all";
                searchQuery = "";
                if (heroSearchInput) heroSearchInput.value = "";
                if (diffSelect) diffSelect.value = "all";
                filterPills.forEach((p) => p.classList.toggle("is-active", p.dataset.filter === "all"));
                renderHeroCards();
            });
        }
        return;
    }

    heroRosterGrid.innerHTML = filtered.map((hero) => {
        const diffStars = "⭐".repeat(hero.difficulty);
        const diffLabel = hero.difficulty === 1 ? "Mudah" : hero.difficulty === 2 ? "Sedang" : "Tinggi";
        return `
            <article class="hero-roster-card" data-hero-id="${hero.id}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="Buka panduan ${hero.name}">
                <div class="roster-card-header">
                    <div class="hero-crop-frame">
                        <img class="hero-crop-img" src="${hero.image}" alt="Portrait cropped avatar ${hero.name}" loading="lazy" width="80" height="80">
                        <span class="hero-role-dot ${hero.subrole}" title="${hero.subroleLabel}"></span>
                    </div>
                    <div class="hero-card-meta">
                        <div class="subrole-badge ${hero.subrole}">${hero.subroleLabel}</div>
                        <h3 class="hero-name">${hero.name}</h3>
                        <span class="hero-title">${hero.title}</span>
                    </div>
                </div>

                <div class="hero-specialties">
                    ${hero.specialty.map((s) => `<span class="spec-pill">${s}</span>`).join("")}
                </div>

                <p class="hero-wincond">"${hero.winCondition}"</p>

                <div class="roster-card-footer">
                    <div class="hero-diff">
                        <small>KESULITAN</small>
                        <span>${diffStars} <em class="diff-text">(${diffLabel})</em></span>
                    </div>
                    <span class="view-detail-link">Buka Build &amp; Kombo <span>→</span></span>
                </div>
            </article>
        `;
    }).join("");

    // Attach click listeners to cards
    heroRosterGrid.querySelectorAll(".hero-roster-card").forEach((card) => {
        card.addEventListener("click", () => {
            const heroId = card.dataset.heroId;
            openHeroModal(heroId);
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const heroId = card.dataset.heroId;
                openHeroModal(heroId);
            }
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// ==========================================
// 6. HERO DETAIL MODAL HANDLER
// ==========================================
function openHeroModal(heroId) {
    const hero = HEROES_DATA.find((h) => h.id === heroId);
    if (!hero || !heroModal || !modalInnerBody) return;

    sfx.radarPing();

    const diffStars = "⭐".repeat(hero.difficulty);
    const diffLabel = hero.difficulty === 1 ? "Mudah (Ramah Pemula)" : hero.difficulty === 2 ? "Sedang (Standar Rank)" : "Tinggi (Butuh Mekanik/Makro)";

    modalInnerBody.innerHTML = `
        <div class="modal-hero-top">
            <div class="modal-crop-wrap">
                <img class="modal-crop-img" src="${hero.image}" alt="Cropped avatar ${hero.name}" width="100" height="100">
                <span class="modal-role-pill ${hero.subrole}">${hero.subroleLabel}</span>
            </div>
            <div class="modal-hero-title">
                <p class="eyebrow"><span class="eyebrow-dot"></span> PANDUAN LENGKAP HERO</p>
                <h2 id="modal-hero-name">${hero.name} <span>${hero.title}</span></h2>
                <div class="modal-meta-pills">
                    <span class="meta-tag"><strong>Role:</strong> ${hero.role}</span>
                    <span class="meta-tag"><strong>Kesulitan:</strong> ${diffStars} ${diffLabel}</span>
                    <span class="meta-tag"><strong>Spell:</strong> ${hero.spell}</span>
                    <span class="meta-tag"><strong>Roam:</strong> ${hero.roamBlessing}</span>
                </div>
            </div>
        </div>

        <!-- Pro Tip Highlight Box -->
        <div class="modal-protip">
            <span class="protip-icon" aria-hidden="true">💡</span>
            <div>
                <strong>Tips Rahasia Roamer ${hero.name}:</strong>
                <p>${hero.proTip}</p>
            </div>
        </div>

        <!-- Pros & Cons Grid -->
        <div class="modal-section-grid">
            <div class="pros-card">
                <h4><span aria-hidden="true">✓</span> Kelebihan &amp; Kekuatan</h4>
                <ul>
                    ${hero.pros.map((p) => `<li>${p}</li>`).join("")}
                </ul>
            </div>
            <div class="cons-card">
                <h4><span aria-hidden="true">⚠</span> Kelemahan &amp; Waspada</h4>
                <ul>
                    ${hero.cons.map((c) => `<li>${c}</li>`).join("")}
                </ul>
            </div>
        </div>

        <!-- Combo Steps -->
        <div class="modal-combo-section">
            <h4 class="modal-heading">Alur Kombo Skill Maut</h4>
            <div class="combo-flow">
                ${hero.combo.map((step, idx) => `
                    <div class="combo-step">
                        <span class="step-num">${String(idx + 1).padStart(2, "0")}</span>
                        <strong>${step}</strong>
                    </div>
                `).join('<span class="combo-arrow" aria-hidden="true">➔</span>')}
            </div>
        </div>

        <!-- 6 Core Defense Items -->
        <div class="modal-build-section">
            <h4 class="modal-heading">Rekomendasi 6 Build Item Standar</h4>
            <div class="build-grid">
                ${hero.build.map((item, idx) => `
                    <div class="item-slot">
                        <span class="item-index">${idx + 1}</span>
                        <div class="item-info">
                            <strong>${item.name}</strong>
                            <p>${item.desc}</p>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>

        <!-- Matchups: Synergy & Counters -->
        <div class="modal-matchups-grid">
            <div class="matchup-box synergy">
                <h5>🔥 Duet Hero Terbaik (Sinergi)</h5>
                <div class="synergy-tags">
                    ${hero.synergy.map((s) => `<span class="synergy-pill">${s}</span>`).join("")}
                </div>
            </div>
            <div class="matchup-box counter">
                <h5>☠️ Hero Counter Lawan (Hati-hati!)</h5>
                <div class="counter-tags">
                    ${hero.counters.map((c) => `<span class="counter-pill">${c}</span>`).join("")}
                </div>
            </div>
        </div>
    `;

    heroModal.hidden = false;
    heroModal.classList.add("is-active");
    document.body.style.overflow = "hidden";
    if (modalCloseBtn) modalCloseBtn.focus();
}

function closeHeroModal() {
    if (!heroModal) return;
    sfx.click();
    heroModal.hidden = true;
    heroModal.classList.remove("is-active");
    document.body.style.overflow = "";
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeHeroModal);
}

if (heroModal) {
    heroModal.addEventListener("click", (e) => {
        if (e.target === heroModal) {
            closeHeroModal();
        }
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && heroModal && !heroModal.hidden) {
        closeHeroModal();
    }
});

// ==========================================
// 7. ROSTER SEARCH & FILTER EVENT LISTENERS
// ==========================================
if (heroSearchInput) {
    heroSearchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (searchClearBtn) {
            searchClearBtn.hidden = searchQuery.length === 0;
        }
        renderHeroCards();
    });
}

if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
        sfx.click();
        heroSearchInput.value = "";
        searchQuery = "";
        searchClearBtn.hidden = true;
        heroSearchInput.focus();
        renderHeroCards();
    });
}

filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
        sfx.click();
        filterPills.forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");
        activeSubrole = pill.dataset.filter || "all";
        renderHeroCards();
    });
});

if (diffSelect) {
    diffSelect.addEventListener("change", (e) => {
        sfx.click();
        activeDifficulty = e.target.value;
        renderHeroCards();
    });
}

// ==========================================
// 8. INTERACTIVE MINIMAP & RADAR CONTROLLER
// ==========================================
const phaseTabs = document.querySelectorAll(".phase-tab");
const roamerPin = document.querySelector("#roamer-pin");
const activePhaseTag = document.querySelector("#active-phase-tag");
const briefingTitle = document.querySelector("#briefing-title");
const briefingRisk = document.querySelector("#briefing-risk");
const briefingDesc = document.querySelector("#briefing-desc");
const mapNodes = document.querySelectorAll(".map-node:not(.node-you)");
const timelineItems = document.querySelectorAll(".timeline-item");
const quickNavBtns = document.querySelectorAll(".nav-step-btn");

function updateRadarPhase(phaseKey, playSfx = false) {
    const data = RADAR_PHASES[phaseKey];
    if (!data) return;

    if (playSfx) {
        sfx.radarPing();
    }

    // Update phase tabs
    phaseTabs.forEach((tab) => {
        const isActive = tab.dataset.phase === phaseKey;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    // Update active phase indicator
    if (activePhaseTag) activePhaseTag.textContent = data.tag;

    // Update briefing
    if (briefingTitle) briefingTitle.textContent = data.title;
    if (briefingRisk) {
        briefingRisk.className = `danger-tag ${data.risk}`;
        briefingRisk.textContent = data.riskText;
    }
    if (briefingDesc) briefingDesc.textContent = data.desc;

    // Move roamer pin
    if (roamerPin) {
        roamerPin.style.top = data.roamerPos.top;
        roamerPin.style.left = data.roamerPos.left;
        roamerPin.classList.add("pulse-anim");
        setTimeout(() => roamerPin.classList.remove("pulse-anim"), 600);
    }

    // Sync with timeline in section 02
    const phaseIndex = Object.keys(RADAR_PHASES).indexOf(phaseKey);
    syncTimelineStep(phaseIndex);
}

function syncTimelineStep(stepIndex) {
    timelineItems.forEach((item, idx) => {
        item.classList.toggle("is-active", idx === stepIndex);
    });
    quickNavBtns.forEach((btn, idx) => {
        btn.classList.toggle("is-active", idx === stepIndex);
    });
}

phaseTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const phase = tab.dataset.phase;
        updateRadarPhase(phase, true);
    });
});

mapNodes.forEach((node) => {
    node.addEventListener("click", () => {
        const nodeKey = node.dataset.node;
        const intel = NODE_INTEL[nodeKey];
        if (!intel) return;

        sfx.radarPing();

        // Highlight clicked node
        mapNodes.forEach((n) => n.classList.remove("node-active"));
        node.classList.add("node-active");

        // Update briefing card
        if (briefingTitle) briefingTitle.textContent = intel.title;
        if (briefingRisk) {
            briefingRisk.className = `danger-tag ${intel.risk}`;
            briefingRisk.textContent = intel.riskText;
        }
        if (briefingDesc) briefingDesc.textContent = intel.desc;
    });
});

quickNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const step = Number(btn.dataset.step);
        const phaseKeys = Object.keys(RADAR_PHASES);
        if (phaseKeys[step]) {
            updateRadarPhase(phaseKeys[step], true);
        }
    });
});

timelineItems.forEach((item) => {
    item.addEventListener("click", () => {
        const step = Number(item.dataset.step);
        const phaseKeys = Object.keys(RADAR_PHASES);
        if (phaseKeys[step]) {
            updateRadarPhase(phaseKeys[step], true);
        }
    });
});

// ==========================================
// 9. DRAFT ASSISTANT CONTROLLER
// ==========================================
const scenarioBtns = document.querySelectorAll(".scenario-btn");
const draftOutputCard = document.querySelector("#draft-output-card");

function renderDraftScenario(scenarioKey, playSfx = false) {
    const data = DRAFT_SCENARIOS[scenarioKey];
    if (!data || !draftOutputCard) return;

    if (playSfx) {
        sfx.radarPing();
    }

    scenarioBtns.forEach((btn) => {
        btn.classList.toggle("is-selected", btn.dataset.scenario === scenarioKey);
    });

    const recommendedHeroes = data.heroes.map((hId) => HEROES_DATA.find((h) => h.id === hId)).filter(Boolean);

    draftOutputCard.innerHTML = `
        <div class="draft-output-header">
            <span class="draft-rec-badge">${data.badge}</span>
            <h3>${data.threat}</h3>
        </div>

        <div class="draft-hero-picks">
            <p class="picks-title">TOP 3 HERO TANK REKOMENDASI COUNTER:</p>
            <div class="hero-picks-grid">
                ${recommendedHeroes.map((h) => `
                    <div class="pick-card" data-hero-id="${h.id}" tabindex="0" role="button" title="Klik untuk lihat panduan ${h.name}">
                        <div class="pick-crop-box">
                            <img class="pick-crop-img" src="${h.image}" alt="Cropped ${h.name}" width="54" height="54">
                            <span class="pick-rank-num">★</span>
                        </div>
                        <div class="pick-meta">
                            <strong>${h.name}</strong>
                            <small>${h.subroleLabel}</small>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="draft-rationale">
            <h4><span aria-hidden="true">💡</span> Kenapa Hero Ini Sangat Efektif?</h4>
            <p>${data.reason}</p>
        </div>

        <div class="draft-gear-advice">
            <div class="advice-col">
                <span class="gear-label">BATTLE SPELL REKOMENDASI:</span>
                <strong>${data.spell}</strong>
            </div>
            <div class="advice-col">
                <span class="gear-label">ITEM DEFENSE WAJIB:</span>
                <strong>${data.coreItem}</strong>
            </div>
        </div>
    `;

    draftOutputCard.querySelectorAll(".pick-card").forEach((card) => {
        card.addEventListener("click", () => {
            const hId = card.dataset.heroId;
            openHeroModal(hId);
        });
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openHeroModal(card.dataset.heroId);
            }
        });
    });
}

scenarioBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const scenario = btn.dataset.scenario;
        renderDraftScenario(scenario, true);
    });
});

// ==========================================
// 10. CHECKLIST LATIHAN & EVALUASI CONTROLLER
// ==========================================
const practiceChecks = [...document.querySelectorAll(".practice-check")];
const progressCount = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const checklistStatus = document.querySelector("#checklist-status");
const roamerRank = document.querySelector("#roamer-rank");
const btnResetChecklist = document.querySelector("#btn-reset-checklist");
const btnCopyEval = document.querySelector("#btn-copy-eval");

const RANK_TIERS = [
    { threshold: 0, title: "Tier: Calon Roamer", sub: "Centang checklist untuk mengukur kesiapan tandingmu!" },
    { threshold: 2, title: "Tier: Roamer Pemula (Elite)", sub: "Bagus! Kamu mulai paham fungsi vision dan map awareness." },
    { threshold: 4, title: "Tier: Roamer Handal (Legend)", sub: "Keren! Kontrol tempo dan setup objektifmu semakin matang." },
    { threshold: 6, title: "Tier: Dewa Vision (Mythical Glory)", sub: "SEMPURNA! Kamu adalah roamer idaman seluruh tim di rank tertinggi!" }
];

function updateProgress(playSfx = true) {
    const completed = practiceChecks.filter((check) => check.checked).length;
    const total = practiceChecks.length;

    // Save state to LocalStorage
    const savedState = practiceChecks.map((c) => ({ val: c.value, checked: c.checked }));
    localStorage.setItem("roamwise_checklist", JSON.stringify(savedState));

    if (progressCount) {
        progressCount.textContent = `${completed} / ${total}`;
    }

    if (progressBar) {
        const pct = total === 0 ? 0 : (completed / total) * 100;
        progressBar.style.width = `${pct}%`;
    }

    if (checklistStatus) {
        checklistStatus.textContent = completed === total
            ? "Luar biasa! Seluruh 6 fokus roamer sudah kamu terapkan."
            : completed === 0
                ? "Pilih checklist untuk mengukur kesiapan tandingmu."
                : `${completed} dari ${total} fokus dikuasai. Lanjutkan evaluasi!`;
    }

    if (roamerRank) {
        let currentTier = RANK_TIERS[0];
        for (const tier of RANK_TIERS) {
            if (completed >= tier.threshold) {
                currentTier = tier;
            }
        }
        roamerRank.innerHTML = `
            <span class="rank-badge">${currentTier.title}</span>
            <small class="rank-subtext">${currentTier.sub}</small>
        `;
    }

    if (playSfx) {
        if (completed === total) {
            sfx.success();
        } else {
            sfx.click();
        }
    }
}

// Load checklist from localStorage
function loadSavedChecklist() {
    try {
        const saved = localStorage.getItem("roamwise_checklist");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                practiceChecks.forEach((check) => {
                    const found = parsed.find((p) => p.val === check.value);
                    if (found) {
                        check.checked = Boolean(found.checked);
                    }
                });
            }
        }
    } catch (e) {
        // Fallback
    }
    updateProgress(false);
}

practiceChecks.forEach((check) => {
    check.addEventListener("change", () => updateProgress(true));
});

if (btnResetChecklist) {
    btnResetChecklist.addEventListener("click", () => {
        sfx.click();
        practiceChecks.forEach((c) => (c.checked = false));
        updateProgress(false);
    });
}

if (btnCopyEval) {
    btnCopyEval.addEventListener("click", () => {
        sfx.click();
        const completed = practiceChecks.filter((c) => c.checked).length;
        const total = practiceChecks.length;
        const summary = `🛡️ ROAMWISE MATCH EVALUATION\nSkor Kesiapan: ${completed}/${total} Fokus Roamer\nTanggal: ${new Date().toLocaleDateString("id-ID")}\n\n"Roamer hebat selalu selangkah lebih dulu."\nKunjungi: Roamwise MLBB`;
        
        navigator.clipboard.writeText(summary).then(() => {
            btnCopyEval.textContent = "Berhasil Disalin! ✓";
            setTimeout(() => {
                btnCopyEval.textContent = "Salin Catatan Match 📋";
            }, 2000);
        }).catch(() => {
            alert("Hasil evaluasi:\n" + summary);
        });
    });
}

// ==========================================
// 11. AUDIO TOGGLE & BACK TO TOP CONTROLLER
// ==========================================
if (soundToggleBtn) {
    const updateSoundUI = () => {
        const isEnabled = sfx.enabled;
        soundToggleBtn.setAttribute("aria-pressed", String(isEnabled));
        const icon = soundToggleBtn.querySelector(".sound-icon");
        const text = soundToggleBtn.querySelector(".sound-text");
        if (icon) icon.textContent = isEnabled ? "🔊" : "🔇";
        if (text) text.textContent = isEnabled ? "SFX: ON" : "SFX: OFF";
    };

    updateSoundUI();

    soundToggleBtn.addEventListener("click", () => {
        sfx.toggle();
        updateSoundUI();
        sfx.click();
    });
}

// Lagu tema: coba autoplay saat halaman dibuka dan tampilkan visualizer audio.
if (siteMusic && musicPlayBtn && musicVisualizer) {
    const visualizerBars = [...musicVisualizer.querySelectorAll("i")];
    let audioContext = null;
    let analyser = null;
    let frequencyData = null;
    let visualizerFrame = 0;
    let visualizerConnected = false;
    const musicPlayer = musicPlayBtn.closest(".music-player");

    const updateMusicUI = () => {
        const isPlaying = !siteMusic.paused && !siteMusic.ended;
        musicVisualizer.classList.toggle("is-playing", isPlaying);
        if (musicPlayer) musicPlayer.classList.toggle("is-playing", isPlaying);
        if (!isPlaying) {
            visualizerBars.forEach((bar) => bar.style.setProperty("--bar-level", "0.14"));
        }
        musicPlayIcon.textContent = isPlaying ? "❚❚" : "▶";
        musicPlayBtn.setAttribute("aria-label", isPlaying ? "Jeda lagu" : "Putar lagu");
        musicPlayBtn.title = isPlaying ? "Jeda lagu" : "Putar lagu";

        if (isPlaying) {
            musicStatus.textContent = "Sedang diputar";
        } else if (siteMusic.error) {
            musicStatus.textContent = "Lagu gagal dimuat";
        } else if (siteMusic.currentTime > 0) {
            musicStatus.textContent = "Lagu dijeda";
        } else {
            musicStatus.textContent = "Klik putar untuk mendengarkan";
        }
    };

    const drawVisualizer = () => {
        if (!analyser || siteMusic.paused) {
            visualizerFrame = 0;
            return;
        }

        analyser.getByteFrequencyData(frequencyData);
        const bucketSize = Math.max(1, Math.floor(frequencyData.length / visualizerBars.length));

        visualizerBars.forEach((bar, index) => {
            const start = index * bucketSize;
            const end = index === visualizerBars.length - 1 ? frequencyData.length : start + bucketSize;
            let total = 0;
            for (let bin = start; bin < end; bin += 1) total += frequencyData[bin];
            const average = total / Math.max(1, end - start) / 255;
            const level = Math.max(0.12, Math.min(1, Math.pow(average, 0.72) * 1.8));
            bar.style.setProperty("--bar-level", level.toFixed(2));
        });

        visualizerFrame = requestAnimationFrame(drawVisualizer);
    };

    const connectVisualizer = async () => {
        if (!visualizerConnected) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;

            audioContext = new AudioContextClass();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.78;
            frequencyData = new Uint8Array(analyser.frequencyBinCount);
            const source = audioContext.createMediaElementSource(siteMusic);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            musicVisualizer.classList.add("is-synced");
            visualizerConnected = true;
        }

        if (audioContext.state === "suspended") await audioContext.resume();
        if (!visualizerFrame && !siteMusic.paused) visualizerFrame = requestAnimationFrame(drawVisualizer);
    };

    musicPlayBtn.addEventListener("click", async () => {
        if (siteMusic.paused) {
            try {
                await connectVisualizer();
                await siteMusic.play();
            } catch (error) {
                musicStatus.textContent = "Klik putar untuk mendengarkan";
            }
        } else {
            siteMusic.pause();
        }
        updateMusicUI();
    });

    if (musicVolumeBtn) {
        musicVolumeBtn.addEventListener("click", () => {
            siteMusic.muted = !siteMusic.muted;
            musicVolumeBtn.setAttribute("aria-pressed", String(siteMusic.muted));
            musicVolumeBtn.setAttribute("aria-label", siteMusic.muted ? "Nyalakan suara lagu" : "Bisukan lagu");
            musicVolumeBtn.title = siteMusic.muted ? "Nyalakan suara lagu" : "Bisukan lagu";
            musicVolumeIcon.textContent = siteMusic.muted ? "🔇" : "🔊";
        });
    }

    siteMusic.addEventListener("play", () => {
        updateMusicUI();
        if (analyser && !visualizerFrame) visualizerFrame = requestAnimationFrame(drawVisualizer);
    });
    siteMusic.addEventListener("pause", updateMusicUI);
    siteMusic.addEventListener("ended", updateMusicUI);
    siteMusic.addEventListener("error", updateMusicUI);

    // Inisialisasi analisis audio pada interaksi pertama agar autoplay tetap memakai audio native.
    const enableSyncedVisualizer = () => {
        connectVisualizer().catch(() => {});
    };
    document.addEventListener("pointerdown", enableSyncedVisualizer, { once: true, passive: true });
    document.addEventListener("keydown", enableSyncedVisualizer, { once: true });

    siteMusic.play().then(updateMusicUI).catch(() => {
        musicStatus.textContent = "Klik putar untuk mendengarkan";
        updateMusicUI();
    });
}

if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        backToTopBtn.classList.toggle("is-visible", window.scrollY > 400);
    });

    backToTopBtn.addEventListener("click", () => {
        sfx.click();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ==========================================
// 12. RESPONSIVE MOBILE NAVIGATION
// ==========================================
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuToggle && mainNav) {
    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
        sfx.click();
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        mainNav.classList.toggle("is-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}

// ==========================================
// 13. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Render hero grid
    renderHeroCards();

    // Render initial draft scenario (without auto-sfx)
    renderDraftScenario("assassin", false);

    // Load saved checklist
    loadSavedChecklist();

    // Initialize radar phase (without auto-sfx)
    updateRadarPhase("early", false);

    // Spotlight hero click handler
    document.querySelectorAll(".spotlight-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const heroId = item.dataset.heroId;
            const hero = HEROES_DATA.find((h) => h.id === heroId);
            if (hero) {
                const pinAvatar = document.querySelector(".roamer-pin-avatar");
                if (pinAvatar) pinAvatar.src = hero.image;
            }
            openHeroModal(heroId);
        });
    });
});
