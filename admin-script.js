// 🔐 بيانات تسجيل دخول المدير
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'fifa2024'
};

// 📋 معلومات تسجيل الدخول للمدير:
// اسم المستخدم: admin
// كلمة المرور: fifa2024

let supabase;
let currentUser = null;

// 🚀 تحميل لوحة الإدارة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ تحميل لوحة الإدارة...');
    
    // إخفاء لوحة الإدارة وإظهار شاشة تسجيل الدخول
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    
    // إعداد قاعدة البيانات
    initializeSupabase();
    
    // إعداد أحداث تسجيل الدخول
    setupLoginEvents();
    
    // إعداد أحداث لوحة الإدارة
    setupAdminEvents();
});

// 🔗 إعداد اتصال Supabase
function initializeSupabase() {
    console.log('🔗 [إدارة] محاولة الاتصال بـ Supabase من ملف Config...');
    
    try {
        // التحقق من وجود إعدادات قاعدة البيانات
        if (typeof window.DATABASE_CONFIG === 'undefined') {
            throw new Error('ملف config.js غير محمل أو غير صحيح');
        }
        
        const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.DATABASE_CONFIG;
        
        console.log('📍 [إدارة] URL:', SUPABASE_URL);
        console.log('🔑 [إدارة] Key exists:', !!SUPABASE_ANON_KEY);
        console.log('🆔 [إدارة] Project ID:', window.getProjectId());
        console.log('⚙️ [إدارة] Config loaded successfully');
        
        // التحقق من تحميل مكتبة Supabase
        if (typeof window.supabase === 'undefined') {
            console.error('❌ [إدارة] مكتبة Supabase غير محملة!');
            showMessage('خطأ: مكتبة قاعدة البيانات غير محملة', 'error');
            return;
        }
        
        // إنشاء عميل Supabase
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ [إدارة] تم إنشاء عميل Supabase بنجاح من ملف Config');
        
        // اختبار الاتصال
        testDatabaseConnection();
        
    } catch (error) {
        console.error('❌ [إدارة] خطأ في إعدادات قاعدة البيانات:', error);
        showMessage('خطأ في إعدادات قاعدة البيانات: ' + error.message, 'error');
    }
}

// 🧪 اختبار اتصال قاعدة البيانات
async function testDatabaseConnection() {
    if (!supabase) {
        console.error('❌ [إدارة] عميل Supabase غير متاح');
        return;
    }
    
    console.log('🧪 [إدارة] اختبار الاتصال بقاعدة البيانات...');
    
    try {
        // اختبار جدول التسجيلات
        const { data: registrations, error: regError } = await supabase
            .from('registrations')
            .select('count', { count: 'exact', head: true });
        
        if (regError) throw regError;
        console.log('✅ [إدارة] جدول التسجيلات متاح');
        
        // اختبار جدول البطولات
        const { data: tournaments, error: tourError } = await supabase
            .from('tournaments')
            .select('count', { count: 'exact', head: true });
        
        if (tourError) throw tourError;
        console.log('✅ [إدارة] جدول البطولات متاح');
        
        // اختبار جدول ترتيب الدوري
        const { data: standings, error: standError } = await supabase
            .from('league_standings')
            .select('count', { count: 'exact', head: true });
        
        if (standError) throw standError;
        console.log('✅ [إدارة] جدول ترتيب الدوري متاح');
        
        console.log('🎉 [إدارة] جميع الاختبارات نجحت! قاعدة البيانات متصلة ومضبوطة');
        
    } catch (error) {
        console.error('💥 [إدارة] فشل اختبار قاعدة البيانات:', error);
        showMessage('❌ فشل في الاتصال بقاعدة البيانات: ' + error.message, 'error');
    }
}

// 🔐 إعداد أحداث تسجيل الدخول
function setupLoginEvents() {
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// 🔐 معالجة تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        currentUser = { username: username, role: 'admin' };
        
        // إخفاء شاشة تسجيل الدخول وإظهار لوحة الإدارة
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        
        // تحميل البيانات الأولية
        loadInitialData();
        
        showMessage('مرحباً بك في لوحة الإدارة!', 'success');
    } else {
        showMessage('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// 🚪 معالجة تسجيل الخروج
function handleLogout() {
    currentUser = null;
    
    // إظهار شاشة تسجيل الدخول وإخفاء لوحة الإدارة
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    
    // مسح النماذج
    document.getElementById('adminLoginForm').reset();
    
    showMessage('تم تسجيل الخروج بنجاح', 'success');
}

// ⚙️ إعداد أحداث لوحة الإدارة
function setupAdminEvents() {
    // أحداث التنقل في الشريط الجانبي
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            showSection(section);
            
            // تحديث الشريط الجانبي
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // أحداث تبويبات التسجيلات
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const status = tab.dataset.status;
            filterRegistrations(status);
            
            // تحديث التبويبات
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    // أحداث تبويبات المباريات
    const matchTabs = document.querySelectorAll('.match-tab');
    matchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tournament = tab.dataset.tournament;
            loadMatches(tournament);
            
            // تحديث التبويبات
            matchTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    // أحداث تبويبات المشاركين
    const participantTabs = document.querySelectorAll('.participant-tab');
    participantTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tournament = tab.dataset.tournament;
            loadParticipants(tournament);
            
            // تحديث التبويبات
            participantTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// 📊 تحميل البيانات الأولية
async function loadInitialData() {
    try {
        await loadOverviewStats();
        await loadRegistrations();
        await loadTournamentStats();
        await loadMatches('league');
        await loadStandings();
        await loadParticipants('league');
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// 📈 تحميل إحصائيات النظرة العامة
async function loadOverviewStats() {
    try {
        // إجمالي التسجيلات
        const { count: totalRegs } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });
        
        // التسجيلات المعلقة
        const { count: pendingRegs } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');
        
        // إجمالي المباريات
        const { count: leagueMatches } = await supabase
            .from('league_matches')
            .select('*', { count: 'exact', head: true });
        
        const { count: knockoutMatches } = await supabase
            .from('knockout_matches')
            .select('*', { count: 'exact', head: true });
        
        // تحديث الإحصائيات
        document.getElementById('totalRegistrations').textContent = totalRegs || 0;
        document.getElementById('pendingRegistrations').textContent = pendingRegs || 0;
        document.getElementById('pendingBadge').textContent = pendingRegs || 0;
        document.getElementById('totalMatches').textContent = (leagueMatches || 0) + (knockoutMatches || 0);
        
        // تحديث الرسم البياني
        updateRegistrationChart();
        updateRecentActivity();
        
    } catch (error) {
        console.error('Error loading overview stats:', error);
    }
}

// 📊 تحديث الرسم البياني
async function updateRegistrationChart() {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('tournament_type')
            .eq('status', 'approved');
        
        if (error) throw error;
        
        const counts = { league: 0, online: 0, offline: 0 };
        data.forEach(reg => {
            counts[reg.tournament_type] = (counts[reg.tournament_type] || 0) + 1;
        });
        
        const chartContent = document.getElementById('registrationChart');
        chartContent.innerHTML = `
            <div class="chart-bars">
                <div class="chart-bar">
                    <div class="bar-container">
                        <div class="bar" style="height: ${Math.max(counts.league * 10, 5)}px;"></div>
                    </div>
                    <div class="bar-label">الدوري</div>
                    <div class="bar-value">${counts.league}</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-container">
                        <div class="bar" style="height: ${Math.max(counts.online * 10, 5)}px;"></div>
                    </div>
                    <div class="bar-label">الرقمي</div>
                    <div class="bar-value">${counts.online}</div>
                </div>
                <div class="chart-bar">
                    <div class="bar-container">
                        <div class="bar" style="height: ${Math.max(counts.offline * 10, 5)}px;"></div>
                    </div>
                    <div class="bar-label">الحضوري</div>
                    <div class="bar-value">${counts.offline}</div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error updating chart:', error);
    }
}

// 📋 تحديث الأنشطة الأخيرة
async function updateRecentActivity() {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('player_name, tournament_type, created_at, status')
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (error) throw error;
        
        const activityList = document.getElementById('recentActivity');
        if (!data || data.length === 0) {
            activityList.innerHTML = '<p>لا توجد أنشطة حديثة</p>';
            return;
        }
        
        activityList.innerHTML = data.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="activity-info">
                    <h4>تسجيل جديد: ${activity.player_name}</h4>
                    <p>${getTournamentName(activity.tournament_type)} - ${formatDate(activity.created_at)}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error updating recent activity:', error);
    }
}

// 📝 تحميل التسجيلات
async function loadRegistrations(status = 'pending') {
    try {
        let query = supabase.from('registrations').select('*').order('created_at', { ascending: false });
        
        if (status !== 'all') {
            query = query.eq('status', status);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        
        displayRegistrations(data || []);
        
    } catch (error) {
        console.error('Error loading registrations:', error);
        showMessage('خطأ في تحميل التسجيلات', 'error');
    }
}

// 🖥️ عرض التسجيلات
function displayRegistrations(registrations) {
    const container = document.getElementById('registrationsList');
    
    if (registrations.length === 0) {
        container.innerHTML = '<p>لا توجد تسجيلات</p>';
        return;
    }
    
    container.innerHTML = registrations.map(reg => `
        <div class="registration-card">
            <div class="registration-header">
                <div class="registration-name">${reg.player_name}</div>
                <span class="registration-status ${reg.status}">${getStatusText(reg.status)}</span>
            </div>
            <div class="registration-info">
                <div class="info-item">
                    <span class="info-label">البريد الإلكتروني</span>
                    <span class="info-value">${reg.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">رقم الهاتف</span>
                    <span class="info-value">${reg.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">البطولة</span>
                    <span class="info-value">${getTournamentName(reg.tournament_type)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">مستوى الخبرة</span>
                    <span class="info-value">${getExperienceText(reg.experience_level)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">تاريخ التسجيل</span>
                    <span class="info-value">${formatDate(reg.created_at)}</span>
                </div>
            </div>
            ${reg.status === 'pending' ? `
                <div class="registration-actions">
                    <button class="btn btn-success" onclick="approveRegistration('${reg.id}', '${reg.player_name}', '${reg.tournament_type}')">
                        <i class="fas fa-check"></i> قبول
                    </button>
                    <button class="btn btn-danger" onclick="rejectRegistration('${reg.id}')">
                        <i class="fas fa-times"></i> رفض
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ✅ قبول التسجيل
async function approveRegistration(registrationId, playerName, tournamentType) {
    try {
        // تحديث حالة التسجيل
        const { error: updateError } = await supabase
            .from('registrations')
            .update({ status: 'approved', updated_at: new Date().toISOString() })
            .eq('id', registrationId);
        
        if (updateError) throw updateError;
        
        // إضافة المشارك إلى جدول المشاركين
        const { error: insertError } = await supabase
            .from('tournament_participants')
            .insert([{
                player_name: playerName,
                email: '', // سيتم تحديثه لاحقاً إذا لزم الأمر
                tournament_type: tournamentType,
                status: 'active'
            }]);
        
        if (insertError) throw insertError;
        
        showMessage(`تم قبول تسجيل ${playerName} بنجاح`, 'success');
        await loadRegistrations();
        await loadOverviewStats();
        await loadParticipants(tournamentType);
        
    } catch (error) {
        console.error('Error approving registration:', error);
        showMessage('خطأ في قبول التسجيل', 'error');
    }
}

// ❌ رفض التسجيل
async function rejectRegistration(registrationId) {
    try {
        const { error } = await supabase
            .from('registrations')
            .update({ status: 'rejected', updated_at: new Date().toISOString() })
            .eq('id', registrationId);
        
        if (error) throw error;
        
        showMessage('تم رفض التسجيل', 'success');
        await loadRegistrations();
        await loadOverviewStats();
        
    } catch (error) {
        console.error('Error rejecting registration:', error);
        showMessage('خطأ في رفض التسجيل', 'error');
    }
}

// 🏆 تحميل إحصائيات البطولات
async function loadTournamentStats() {
    try {
        // إحصائيات الدوري
        const { count: leagueCount } = await supabase
            .from('tournament_participants')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_type', 'league');
        
        // إحصائيات الرقمي
        const { count: onlineCount } = await supabase
            .from('tournament_participants')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_type', 'online');
        
        // إحصائيات الحضوري
        const { count: offlineCount } = await supabase
            .from('tournament_participants')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_type', 'offline');
        
        // تحديث العرض
        document.getElementById('leagueParticipants').textContent = `${leagueCount || 0}/16`;
        document.getElementById('onlineParticipants').textContent = `${onlineCount || 0}/32`;
        document.getElementById('offlineParticipants').textContent = `${offlineCount || 0}/16`;
        
    } catch (error) {
        console.error('Error loading tournament stats:', error);
    }
}

// 🥅 تحميل المباريات
async function loadMatches(tournament = 'league') {
    try {
        let data, error;
        
        if (tournament === 'league') {
            ({ data, error } = await supabase
                .from('league_matches')
                .select('*')
                .order('match_date', { ascending: false }));
        } else {
            ({ data, error } = await supabase
                .from('knockout_matches')
                .select('*')
                .eq('tournament_type', tournament)
                .order('match_date', { ascending: false }));
        }
        
        if (error) throw error;
        
        displayMatches(data || [], tournament);
        
    } catch (error) {
        console.error('Error loading matches:', error);
        showMessage('خطأ في تحميل المباريات', 'error');
    }
}

// 🖥️ عرض المباريات
function displayMatches(matches, tournament) {
    const container = document.getElementById('matchesList');
    
    if (matches.length === 0) {
        container.innerHTML = '<p>لا توجد مباريات</p>';
        return;
    }
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-info">
                <div class="match-teams">${match.team1_name} VS ${match.team2_name}</div>
                <div class="match-score">
                    ${match.team1_score !== null ? `${match.team1_score} - ${match.team2_score}` : 'لم تحدد'}
                </div>
                <div class="match-date">${formatDate(match.match_date)}</div>
                ${tournament !== 'league' ? `<div class="match-round">الجولة ${match.round}</div>` : ''}
            </div>
            <div class="match-actions">
                <button class="btn btn-warning btn-sm" onclick="editMatch('${match.id}', '${tournament}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteMatch('${match.id}', '${tournament}')">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        </div>
    `).join('');
}

// 📊 تحميل الترتيب
async function loadStandings() {
    try {
        const { data, error } = await supabase
            .from('league_standings')
            .select('*')
            .order('points', { ascending: false })
            .order('goal_difference', { ascending: false });
        
        if (error) throw error;
        
        displayStandings(data || []);
        
    } catch (error) {
        console.error('Error loading standings:', error);
    }
}

// 🖥️ عرض الترتيب
function displayStandings(standings) {
    const container = document.getElementById('standingsContent');
    
    if (standings.length === 0) {
        container.innerHTML = '<p>لا توجد بيانات ترتيب</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="standings-table">
            <thead>
                <tr>
                    <th>الترتيب</th>
                    <th>الفريق</th>
                    <th>لعب</th>
                    <th>فوز</th>
                    <th>تعادل</th>
                    <th>خسارة</th>
                    <th>له</th>
                    <th>عليه</th>
                    <th>الفارق</th>
                    <th>النقاط</th>
                </tr>
            </thead>
            <tbody>
                ${standings.map((team, index) => `
                    <tr>
                        <td class="position">${index + 1}</td>
                        <td class="team-name">${team.team_name}</td>
                        <td>${team.matches_played}</td>
                        <td>${team.wins}</td>
                        <td>${team.draws}</td>
                        <td>${team.losses}</td>
                        <td>${team.goals_for}</td>
                        <td>${team.goals_against}</td>
                        <td>${team.goal_difference > 0 ? '+' : ''}${team.goal_difference}</td>
                        <td class="points">${team.points}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// 👥 تحميل المشاركين
async function loadParticipants(tournament = 'league') {
    try {
        const { data, error } = await supabase
            .from('tournament_participants')
            .select('*')
            .eq('tournament_type', tournament)
            .order('joined_at', { ascending: false });
        
        if (error) throw error;
        
        displayParticipants(data || [], tournament);
        
    } catch (error) {
        console.error('Error loading participants:', error);
    }
}

// 🖥️ عرض المشاركين
function displayParticipants(participants, tournament) {
    const container = document.getElementById('participantsList');
    
    if (participants.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>لا توجد مشاركين في هذه البطولة</p>
                <button class="btn btn-primary" onclick="showAddParticipantModal('${tournament}')">
                    <i class="fas fa-plus"></i> إضافة مشارك
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <button class="btn btn-primary" onclick="showAddParticipantModal('${tournament}')">
                <i class="fas fa-plus"></i> إضافة مشارك
            </button>
        </div>
        <div class="participants-grid">
            ${participants.map(participant => `
                <div class="participant-card">
                    <div class="participant-name">${participant.player_name}</div>
                    <div class="participant-email">${participant.email || 'لا يوجد بريد'}</div>
                    <div class="participant-status ${participant.status}">${getParticipantStatusText(participant.status)}</div>
                    <div class="participant-actions" style="margin-top: 1rem;">
                        <button class="btn btn-warning btn-sm" onclick="editParticipant('${participant.id}')">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="removeParticipant('${participant.id}', '${tournament}')">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ➕ إظهار نافذة إضافة مشارك
function showAddParticipantModal(tournament) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>إضافة مشارك جديد - ${getTournamentName(tournament)}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <form class="modal-form" onsubmit="handleAddParticipant(event, '${tournament}')">
                <div class="form-group">
                    <label>اسم اللاعب</label>
                    <input type="text" name="playerName" required>
                </div>
                <div class="form-group">
                    <label>البريد الإلكتروني (اختياري)</label>
                    <input type="email" name="email">
                </div>
                <div class="form-group">
                    <label>رقم البذرة (اختياري)</label>
                    <input type="number" name="seedNumber" min="1">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">إلغاء</button>
                    <button type="submit" class="btn btn-success">إضافة المشارك</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

// ✅ معالجة إضافة مشارك
async function handleAddParticipant(event, tournament) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const participantData = {
        player_name: formData.get('playerName'),
        email: formData.get('email') || '',
        tournament_type: tournament,
        seed_number: formData.get('seedNumber') ? parseInt(formData.get('seedNumber')) : null,
        status: 'active'
    };
    
    try {
        const { error } = await supabase
            .from('tournament_participants')
            .insert([participantData]);
        
        if (error) throw error;
        
        showMessage(`تم إضافة المشارك ${participantData.player_name} بنجاح`, 'success');
        event.target.closest('.modal').remove();
        await loadParticipants(tournament);
        await loadTournamentStats();
        
    } catch (error) {
        console.error('Error adding participant:', error);
        showMessage('خطأ في إضافة المشارك', 'error');
    }
}

// 🗑️ حذف مشارك
async function removeParticipant(participantId, tournament) {
    if (!confirm('هل أنت متأكد من حذف هذا المشارك؟')) return;
    
    try {
        const { error } = await supabase
            .from('tournament_participants')
            .delete()
            .eq('id', participantId);
        
        if (error) throw error;
        
        showMessage('تم حذف المشارك بنجاح', 'success');
        await loadParticipants(tournament);
        await loadTournamentStats();
        
    } catch (error) {
        console.error('Error removing participant:', error);
        showMessage('خطأ في حذف المشارك', 'error');
    }
}

// ➕ إظهار نافذة إضافة مباراة
function showAddMatchModal() {
    const modal = document.getElementById('addMatchModal');
    modal.style.display = 'block';
    
    // تحميل المشاركين في القوائم المنسدلة
    loadParticipantsForMatch();
}

// 📝 تحميل المشاركين لنافذة المباراة
async function loadParticipantsForMatch() {
    const tournamentSelect = document.getElementById('matchTournament');
    const team1Select = document.getElementById('team1');
    const team2Select = document.getElementById('team2');
    
    // مراقبة تغيير البطولة
    tournamentSelect.addEventListener('change', async function() {
        const tournament = this.value;
        if (!tournament) {
            team1Select.innerHTML = '<option value="">اختر الفريق الأول</option>';
            team2Select.innerHTML = '<option value="">اختر الفريق الثاني</option>';
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('tournament_participants')
                .select('player_name')
                .eq('tournament_type', tournament)
                .eq('status', 'active');
            
            if (error) throw error;
            
            const options = data.map(p => `<option value="${p.player_name}">${p.player_name}</option>`).join('');
            
            team1Select.innerHTML = '<option value="">اختر الفريق الأول</option>' + options;
            team2Select.innerHTML = '<option value="">اختر الفريق الثاني</option>' + options;
            
        } catch (error) {
            console.error('Error loading participants for match:', error);
        }
    });
}

// ❌ إغلاق نافذة إضافة مباراة
function closeAddMatchModal() {
    const modal = document.getElementById('addMatchModal');
    modal.style.display = 'none';
    document.getElementById('addMatchForm').reset();
}

// ✅ معالجة إضافة مباراة
async function handleAddMatch(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const matchData = {
        tournament_type: formData.get('tournament'),
        team1_name: formData.get('team1'),
        team2_name: formData.get('team2'),
        team1_score: parseInt(formData.get('score1')),
        team2_score: parseInt(formData.get('score2')),
        match_date: formData.get('matchDate'),
        status: 'finished'
    };
    
    // التحقق من عدم اختيار نفس الفريق
    if (matchData.team1_name === matchData.team2_name) {
        showMessage('لا يمكن أن يلعب الفريق ضد نفسه', 'error');
        return;
    }
    
    try {
        let error;
        
        if (matchData.tournament_type === 'league') {
            // إضافة مباراة دوري
            ({ error } = await supabase
                .from('league_matches')
                .insert([{
                    team1_name: matchData.team1_name,
                    team2_name: matchData.team2_name,
                    team1_score: matchData.team1_score,
                    team2_score: matchData.team2_score,
                    match_date: matchData.match_date,
                    status: matchData.status
                }]));
            
            if (!error) {
                // تحديث ترتيب الدوري
                await updateLeagueStandings(matchData);
            }
        } else {
            // إضافة مباراة إقصاء
            const round = parseInt(formData.get('round')) || 1;
            ({ error } = await supabase
                .from('knockout_matches')
                .insert([{
                    tournament_type: matchData.tournament_type,
                    team1_name: matchData.team1_name,
                    team2_name: matchData.team2_name,
                    team1_score: matchData.team1_score,
                    team2_score: matchData.team2_score,
                    winner: matchData.team1_score > matchData.team2_score ? matchData.team1_name : matchData.team2_name,
                    round: round,
                    match_number: 1,
                    match_date: matchData.match_date,
                    status: matchData.status
                }]));
        }
        
        if (error) throw error;
        
        showMessage('تم إضافة المباراة بنجاح', 'success');
        closeAddMatchModal();
        await loadMatches(matchData.tournament_type);
        if (matchData.tournament_type === 'league') {
            await loadStandings();
        }
        
    } catch (error) {
        console.error('Error adding match:', error);
        showMessage('خطأ في إضافة المباراة: ' + error.message, 'error');
    }
}

// 📊 تحديث ترتيب الدوري
async function updateLeagueStandings(matchData) {
    try {
        // تحديث إحصائيات الفريق الأول
        await updateTeamStats(matchData.team1_name, matchData.team1_score, matchData.team2_score);
        
        // تحديث إحصائيات الفريق الثاني
        await updateTeamStats(matchData.team2_name, matchData.team2_score, matchData.team1_score);
        
    } catch (error) {
        console.error('Error updating league standings:', error);
    }
}

// 📈 تحديث إحصائيات الفريق
async function updateTeamStats(teamName, goalsFor, goalsAgainst) {
    try {
        // البحث عن الفريق
        let { data: team, error: selectError } = await supabase
            .from('league_standings')
            .select('*')
            .eq('team_name', teamName)
            .single();
        
        if (selectError && selectError.code !== 'PGRST116') {
            throw selectError;
        }
        
        // إنشاء فريق جديد إذا لم يكن موجوداً
        if (!team) {
            const { error: insertError } = await supabase
                .from('league_standings')
                .insert([{
                    team_name: teamName,
                    matches_played: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goals_for: 0,
                    goals_against: 0,
                    goal_difference: 0,
                    points: 0
                }]);
            
            if (insertError) throw insertError;
            
            // إعادة جلب البيانات
            ({ data: team, error: selectError } = await supabase
                .from('league_standings')
                .select('*')
                .eq('team_name', teamName)
                .single());
            
            if (selectError) throw selectError;
        }
        
        // حساب النتيجة
        let wins = team.wins;
        let draws = team.draws;
        let losses = team.losses;
        let points = team.points;
        
        if (goalsFor > goalsAgainst) {
            wins += 1;
            points += 3;
        } else if (goalsFor === goalsAgainst) {
            draws += 1;
            points += 1;
        } else {
            losses += 1;
        }
        
        // تحديث الإحصائيات
        const { error: updateError } = await supabase
            .from('league_standings')
            .update({
                matches_played: team.matches_played + 1,
                wins: wins,
                draws: draws,
                losses: losses,
                goals_for: team.goals_for + goalsFor,
                goals_against: team.goals_against + goalsAgainst,
                goal_difference: (team.goals_for + goalsFor) - (team.goals_against + goalsAgainst),
                points: points,
                updated_at: new Date().toISOString()
            })
            .eq('team_name', teamName);
        
        if (updateError) throw updateError;
        
    } catch (error) {
        console.error(`Error updating stats for ${teamName}:`, error);
        throw error;
    }
}

// 🔄 إعادة حساب الترتيب
async function recalculateStandings() {
    if (!confirm('هل أنت متأكد من إعادة حساب الترتيب؟ سيتم حذف جميع البيانات الحالية.')) return;
    
    try {
        // حذف جميع بيانات الترتيب الحالية
        const { error: deleteError } = await supabase
            .from('league_standings')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // حذف جميع السجلات
        
        if (deleteError) throw deleteError;
        
        // جلب جميع مباريات الدوري
        const { data: matches, error: matchesError } = await supabase
            .from('league_matches')
            .select('*')
            .not('team1_score', 'is', null)
            .not('team2_score', 'is', null);
        
        if (matchesError) throw matchesError;
        
        // إعادة حساب الإحصائيات
        for (const match of matches) {
            await updateLeagueStandings({
                team1_name: match.team1_name,
                team2_name: match.team2_name,
                team1_score: match.team1_score,
                team2_score: match.team2_score
            });
        }
        
        showMessage('تم إعادة حساب الترتيب بنجاح', 'success');
        await loadStandings();
        
    } catch (error) {
        console.error('Error recalculating standings:', error);
        showMessage('خطأ في إعادة حساب الترتيب', 'error');
    }
}

// 🗑️ حذف مباراة
async function deleteMatch(matchId, tournament) {
    if (!confirm('هل أنت متأكد من حذف هذه المباراة؟')) return;
    
    try {
        const tableName = tournament === 'league' ? 'league_matches' : 'knockout_matches';
        
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', matchId);
        
        if (error) throw error;
        
        showMessage('تم حذف المباراة بنجاح', 'success');
        await loadMatches(tournament);
        
        if (tournament === 'league') {
            // إعادة حساب الترتيب بعد حذف مباراة دوري
            await recalculateStandings();
        }
        
    } catch (error) {
        console.error('Error deleting match:', error);
        showMessage('خطأ في حذف المباراة', 'error');
    }
}

// 🔄 تحديث التسجيلات
function refreshRegistrations() {
    loadRegistrations();
    showMessage('تم تحديث التسجيلات', 'success');
}

// 🏆 إدارة البطولة
function manageTournament(type) {
    showSection('participants');
    loadParticipants(type);
    
    // تحديث التبويبات
    document.querySelectorAll('.participant-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tournament === type) {
            tab.classList.add('active');
        }
    });
}

// 📱 عرض القسم
function showSection(sectionName) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار القسم المطلوب
    document.getElementById(sectionName).classList.add('active');
    
    // تحميل البيانات حسب القسم
    switch(sectionName) {
        case 'overview':
            loadOverviewStats();
            break;
        case 'registrations':
            loadRegistrations();
            break;
        case 'matches':
            loadMatches('league');
            break;
        case 'standings':
            loadStandings();
            break;
        case 'participants':
            loadParticipants('league');
            break;
    }
}

// 🔍 تصفية التسجيلات
function filterRegistrations(status) {
    loadRegistrations(status);
}

// 🛠️ دوال مساعدة
function getTournamentName(type) {
    const names = {
        'league': 'بطولة الدوري الممتاز',
        'online': 'كأس فيفا الرقمي',
        'offline': 'بطولة الأبطال الحضورية'
    };
    return names[type] || type;
}

function getStatusText(status) {
    const texts = {
        'pending': 'معلق',
        'approved': 'مقبول',
        'rejected': 'مرفوض'
    };
    return texts[status] || status;
}

function getExperienceText(level) {
    const texts = {
        'beginner': 'مبتدئ',
        'intermediate': 'متوسط',
        'advanced': 'متقدم',
        'professional': 'محترف'
    };
    return texts[level] || level;
}

function getParticipantStatusText(status) {
    const texts = {
        'active': 'نشط',
        'eliminated': 'مُقصى',
        'winner': 'فائز'
    };
    return texts[status] || status;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 💬 عرض الرسائل
function showMessage(message, type) {
    // إزالة الرسائل السابقة
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // إزالة الرسالة بعد 5 ثوان
    setTimeout(() => {
        if (messageDiv && messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// إضافة معالج النموذج عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const addMatchForm = document.getElementById('addMatchForm');
    if (addMatchForm) {
        addMatchForm.addEventListener('submit', handleAddMatch);
    }
});
