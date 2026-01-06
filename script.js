let supabase = null;
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
let sliderInterval;

document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 تحميل الموقع...");
    initializeSupabase();
    initializeSlider();
    setupEventListeners();
});

function initializeSupabase() {
    console.log("🔗 محاولة الاتصال بـ Supabase من ملف Config...");
    try {
        window.validateConfig();
        const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.DATABASE_CONFIG;

        if (typeof window.supabase === 'undefined') {
            console.error("❌ مكتبة Supabase غير محملة!");
            showMessage("خطأ: مكتبة قاعدة البيانات غير محملة", "error");
            return;
        }

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("✅ تم إنشاء عميل Supabase بنجاح");
        testDatabaseConnection();
    } catch (error) {
        console.error("❌ خطأ في إعدادات قاعدة البيانات:", error);
        showMessage("خطأ في إعدادات قاعدة البيانات: " + error.message, "error");
    }
}

async function testDatabaseConnection() {
    if (!supabase) {
        console.error("❌ عميل Supabase غير متاح");
        return;
    }

    console.log("🧪 اختبار الاتصال بقاعدة البيانات...");

    try {
        const { data, error } = await supabase.from("tournaments").select("*").limit(1);

        if (error) throw error;

        console.log("✅ جميع الاختبارات نجحت! قاعدة البيانات متصلة");
        showMessage("✅ تم الاتصال بقاعدة البيانات بنجاح", "success");
        loadInitialData();
    } catch (error) {
        console.error("💥 فشل اختبار قاعدة البيانات:", error);
        showMessage("❌ فشل في الاتصال بقاعدة البيانات: " + error.message, "error");
    }
}

async function loadInitialData() {
    console.log("📊 تحميل البيانات الأولية...");
}

function initializeSlider() {
    if (slides.length > 0) {
        slides[0].classList.add("active");
        sliderInterval = setInterval(nextSlide, 5000);
    }
}

function nextSlide() {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
}

function prevSlide() {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    slides[slideIndex].classList.add("active");
}

function setupEventListeners() {
    document.querySelector(".next-btn")?.addEventListener("click", () => {
        clearInterval(sliderInterval);
        nextSlide();
        sliderInterval = setInterval(nextSlide, 5000);
    });

    document.querySelector(".prev-btn")?.addEventListener("click", () => {
        clearInterval(sliderInterval);
        prevSlide();
        sliderInterval = setInterval(nextSlide, 5000);
    });

    const registrationForm = document.getElementById("registrationForm");
    registrationForm?.addEventListener("submit", handleRegistration);

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}

window.showTournamentDetails = function(tournament) {
    document.querySelector(".tournament-selection-grid").style.display = "none";
    document.querySelector(".tournament-selection-header").style.display = "none";
    document.getElementById("tournamentDetailsSection").style.display = "block";

    const titles = {
        league: "بطولة الدوري الممتاز",
        online: "كأس فيفا الرقمي",
        offline: "بطولة الأبطال الحضورية"
    };

    document.getElementById("selectedTournamentTitle").textContent = titles[tournament];
    loadTournamentDetails(tournament);
    document.getElementById("tournamentDetailsSection").scrollIntoView({ behavior: "smooth", block: "start" });
};

window.hideTournamentDetails = function() {
    document.querySelector(".tournament-selection-grid").style.display = "grid";
    document.querySelector(".tournament-selection-header").style.display = "block";
    document.getElementById("tournamentDetailsSection").style.display = "none";
    document.getElementById("tournaments").scrollIntoView({ behavior: "smooth", block: "start" });
};

async function loadTournamentDetails(tournament) {
    setupTabs();
    loadTournamentInfo(tournament);
    await loadTournamentStandings(tournament);
    await loadTournamentMatches(tournament);
}

function setupTabs() {
    const tabButtons = document.querySelectorAll(".details-tab-btn");
    const tabPanes = document.querySelectorAll(".details-tab-pane");

    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));

            button.classList.add("active");
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add("active");
        });
    });
}

function loadTournamentInfo(tournament) {
    const info = {
        league: {
            info: ["نظام الدوري الدائري", "16 فريق مشارك", "مدة البطولة: 6 أسابيع"],
            prizes: ["المركز الأول: 10,000 ريال", "المركز الثاني: 5,000 ريال"],
            rules: ["كل فريق يلعب ضد جميع الفرق مرة واحدة", "مدة المباراة: 6 دقائق"]
        },
        online: {
            info: ["نظام الإقصاء المباشر", "32 لاعب مشارك", "اللعب عبر الإنترنت"],
            prizes: ["البطل: 8,000 ريال", "الوصيف: 4,000 ريال"],
            rules: ["من يخسر يخرج", "مدة المباراة: 6 دقائق"]
        },
        offline: {
            info: ["نظام الإقصاء المباشر", "16 لاعب مشارك", "المكان: الرياض"],
            prizes: ["البطل: 15,000 ريال", "الوصيف: 7,500 ريال"],
            rules: ["من يخسر يخرج", "مدة المباراة: 6 دقائق"]
        }
    }[tournament];

    document.getElementById("tournamentInfoInline").innerHTML = "<ul>" + info.info.map(item => `<li>${item}</li>`).join("") + "</ul>";
    document.getElementById("tournamentPrizesInline").innerHTML = "<ul>" + info.prizes.map(item => `<li>${item}</li>`).join("") + "</ul>";
    document.getElementById("tournamentRulesInline").innerHTML = "<ul>" + info.rules.map(item => `<li>${item}</li>`).join("") + "</ul>";
}

async function loadTournamentStandings(tournament) {
    if (!supabase) return;

    try {
        if (tournament === "league") {
            const { data, error } = await supabase
                .from("league_standings")
                .select("*")
                .order("points", { ascending: false })
                .limit(10);

            if (error) throw error;

            const container = document.getElementById("tournamentStandingsInline");
            if (!data || data.length === 0) {
                container.innerHTML = "<p>لا توجد بيانات حتى الآن</p>";
                return;
            }

            container.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>الترتيب</th>
                            <th>الفريق</th>
                            <th>النقاط</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((team, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${team.team_name}</td>
                                <td>${team.points}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error("Error loading standings:", error);
    }
}

async function loadTournamentMatches(tournament) {
    if (!supabase) return;

    try {
        let data, error;

        if (tournament === "league") {
            ({ data, error } = await supabase.from("league_matches").select("*").limit(5));
        } else {
            ({ data, error } = await supabase.from("knockout_matches").select("*").eq("tournament_type", tournament).limit(5));
        }

        if (error) throw error;

        const container = document.getElementById("tournamentMatchesInline");
        if (!data || data.length === 0) {
            container.innerHTML = "<p>لا توجد مباريات حتى الآن</p>";
            return;
        }

        container.innerHTML = `
            <div class="match-list">
                ${data.map(match => `
                    <div class="match-item">
                        <div>${match.team1_name} VS ${match.team2_name}</div>
                        <div>${match.team1_score !== null ? match.team1_score + " - " + match.team2_score : "قيد اللعب"}</div>
                    </div>
                `).join("")}
            </div>
        `;
    } catch (error) {
        console.error("Error loading matches:", error);
    }
}

async function handleRegistration(event) {
    event.preventDefault();

    if (!supabase) {
        showMessage("خطأ: قاعدة البيانات غير متصلة", "error");
        return;
    }

    const formData = new FormData(event.target);
    const registration = {
        player_name: formData.get("playerName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        tournament_type: formData.get("tournament"),
        experience_level: formData.get("experience"),
        status: "pending"
    };

    try {
        const { error } = await supabase
            .from("registrations")
            .insert([registration]);

        if (error) throw error;

        showMessage("تم التسجيل بنجاح! سيتم مراجعة طلبك قريباً", "success");
        event.target.reset();
    } catch (error) {
        console.error("Error registering:", error);
        showMessage("خطأ في التسجيل: " + error.message, "error");
    }
}

function showMessage(message, type = "info") {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#4caf50" : type === "error" ? "#f44336" : "#2196f3"};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => messageDiv.remove(), 4000);
}
