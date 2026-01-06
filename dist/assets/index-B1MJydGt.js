(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}})();let l=0;const c=document.querySelectorAll(".slide");let u,i;const b=document.getElementById("tournamentModal"),m=document.getElementById("registrationForm");document.addEventListener("DOMContentLoaded",function(){console.log("🚀 تحميل الموقع..."),S(),T(),k(),j()});function S(){console.log("🔗 محاولة الاتصال بـ Supabase من ملف Config...");try{window.validateConfig();const{SUPABASE_URL:e,SUPABASE_ANON_KEY:n}=window.DATABASE_CONFIG;if(console.log("📍 URL:",e),console.log("🔑 Key exists:",!!n),console.log("🆔 Project ID:",window.getProjectId()),console.log("🏆 Tournament Settings:",window.DATABASE_CONFIG.TOURNAMENT_SETTINGS),typeof window.supabase>"u"){console.error("❌ مكتبة Supabase غير محملة!"),d("خطأ: مكتبة قاعدة البيانات غير محملة","error");return}i=window.supabase.createClient(e,n),console.log("✅ تم إنشاء عميل Supabase بنجاح من ملف Config"),E()}catch(e){console.error("❌ خطأ في إعدادات قاعدة البيانات:",e),d("خطأ في إعدادات قاعدة البيانات: "+e.message,"error"),console.log(`
🔧 لإصلاح المشكلة:
1. افتح ملف: config.js
2. تأكد من صحة SUPABASE_URL و SUPABASE_ANON_KEY
3. احفظ الملف وحدث الصفحة
        `)}}async function E(){if(!i){console.error("❌ عميل Supabase غير متاح");return}console.log("🧪 اختبار الاتصال بقاعدة البيانات...");try{console.log("🔍 اختبار الاتصال الأساسي...");const{data:e,error:n}=await i.from("tournaments").select("*").limit(1);if(n){if(console.error("❌ فشل الاتصال الأساسي:",n),n.code==="42P01"){console.log("🔧 الجداول غير موجودة، محاولة إنشائها..."),await _();return}throw n}console.log("✅ الاتصال الأساسي نجح");const{data:r,error:t}=await i.from("registrations").select("count",{count:"exact",head:!0});if(t)throw console.error("❌ خطأ في جدول التسجيلات:",t),t;console.log("✅ جدول التسجيلات متاح");const{data:o,error:a}=await i.from("tournaments").select("count",{count:"exact",head:!0});if(a)throw console.error("❌ خطأ في جدول البطولات:",a),a;console.log("✅ جدول البطولات متاح");const{data:s,error:f}=await i.from("league_standings").select("count",{count:"exact",head:!0});if(f)throw console.error("❌ خطأ في جدول ترتيب الدوري:",f),f;console.log("✅ جدول ترتيب الدوري متاح");const{data:z,error:h}=await i.from("league_matches").select("count",{count:"exact",head:!0});if(h)throw console.error("❌ خطأ في جدول مباريات الدوري:",h),h;console.log("✅ جدول مباريات الدوري متاح");const{data:U,error:v}=await i.from("knockout_matches").select("count",{count:"exact",head:!0});if(v)throw console.error("❌ خطأ في جدول مباريات الإقصاء:",v),v;console.log("✅ جدول مباريات الإقصاء متاح");const{data:R,error:p}=await i.from("tournament_participants").select("count",{count:"exact",head:!0});if(p)throw console.error("❌ خطأ في جدول المشاركين:",p),p;console.log("✅ جدول المشاركين متاح"),console.log("🎉 جميع الاختبارات نجحت! قاعدة البيانات متصلة ومضبوطة (6 جداول)"),d("✅ تم الاتصال بقاعدة البيانات بنجاح","success"),await L()}catch(e){console.error("💥 فشل اختبار قاعدة البيانات:",e),d("❌ فشل في الاتصال بقاعدة البيانات: "+e.message,"error"),e.code&&console.error("🔍 كود الخطأ:",e.code),e.details&&console.error("🔍 تفاصيل الخطأ:",e.details),e.hint&&console.error("🔍 اقتراح الحل:",e.hint)}}async function _(){console.log("🔧 محاولة إنشاء الجداول المطلوبة..."),d("⚠️ الجداول غير موجودة. يرجى تطبيق migration في Supabase أولاً","error"),console.log(`
📋 تعليمات إنشاء قاعدة البيانات:
1. اذهب إلى Supabase Dashboard
2. اختر مشروعك
3. اذهب إلى SQL Editor
4. انسخ محتوى ملف: supabase/migrations/create_complete_tournament_system.sql
5. شغل الكود
6. حدث الصفحة
    `)}async function L(){console.log("📊 تحميل البيانات الأولية...");try{await w(),console.log("✅ تم تحميل إحصائيات البطولات"),await I(),console.log("✅ تم تحميل بيانات الترتيب"),await $(),console.log("✅ تم تحميل بيانات المباريات")}catch(e){console.error("⚠️ خطأ في تحميل البيانات الأولية:",e)}}async function I(){if(i)try{const{data:e,error:n}=await i.from("league_standings").select("*").order("points",{ascending:!1}).limit(5);if(n)throw n;e&&e.length>0?console.log("📈 عدد الفرق في الترتيب:",e.length):console.log("📝 لا توجد بيانات ترتيب حتى الآن")}catch(e){console.error("خطأ في تحميل الترتيب:",e)}}async function $(){if(i)try{const{data:e,error:n}=await i.from("league_matches").select("*").limit(3);if(n)throw n;const{data:r,error:t}=await i.from("knockout_matches").select("*").limit(3);if(t)throw t;e&&e.length>0&&console.log("📈 عدد مباريات الدوري:",e.length),r&&r.length>0&&console.log("📈 عدد مباريات الإقصاء:",r.length)}catch(e){console.error("خطأ في تحميل المباريات:",e)}}function T(){c.length>0&&(c[0].classList.add("active"),u=setInterval(g,5e3))}function g(){c[l].classList.remove("active"),l=(l+1)%c.length,c[l].classList.add("active")}function M(){c[l].classList.remove("active"),l=(l-1+c.length)%c.length,c[l].classList.add("active")}function k(){var e,n;(e=document.querySelector(".next-btn"))==null||e.addEventListener("click",()=>{clearInterval(u),g(),u=setInterval(g,5e3)}),(n=document.querySelector(".prev-btn"))==null||n.addEventListener("click",()=>{clearInterval(u),M(),u=setInterval(g,5e3)}),window.addEventListener("click",r=>{r.target===b&&C()}),m==null||m.addEventListener("submit",O),document.querySelectorAll('a[href^="#"]').forEach(r=>{r.addEventListener("click",function(t){t.preventDefault();const o=document.querySelector(this.getAttribute("href"));o&&o.scrollIntoView({behavior:"smooth",block:"start"})})})}window.showTournamentDetails=function(e){document.querySelector(".tournament-selection-grid").style.display="none",document.querySelector(".tournament-selection-header").style.display="none",document.getElementById("tournamentDetailsSection").style.display="block";const n={league:"بطولة الدوري الممتاز",online:"كأس فيفا الرقمي",offline:"بطولة الأبطال الحضورية"};document.getElementById("selectedTournamentTitle").textContent=n[e],D(e),x(),document.getElementById("tournamentDetailsSection").scrollIntoView({behavior:"smooth",block:"start"})};window.hideTournamentDetails=function(){document.querySelector(".tournament-selection-grid").style.display="grid",document.querySelector(".tournament-selection-header").style.display="block",document.getElementById("tournamentDetailsSection").style.display="none",document.getElementById("tournaments").scrollIntoView({behavior:"smooth",block:"start"})};function x(){const e=document.querySelectorAll(".details-tab-btn"),n=document.querySelectorAll(".details-tab-pane");e.forEach(r=>{r.addEventListener("click",()=>{e.forEach(o=>o.classList.remove("active")),n.forEach(o=>o.classList.remove("active")),r.classList.add("active");const t=r.dataset.tab;document.getElementById(t).classList.add("active")})})}async function D(e){A(e),e==="league"?await B():await q(e),await N(e),H(e)}function A(e){const r={league:{info:["نظام الدوري الدائري","16 فريق مشارك","مدة البطولة: 6 أسابيع","نظام النقاط: فوز = 3، تعادل = 1، خسارة = 0"],prizes:["المركز الأول: 10,000 ريال","المركز الثاني: 5,000 ريال","المركز الثالث: 2,500 ريال","أفضل لاعب: 1,000 ريال"],rules:["كل فريق يلعب ضد جميع الفرق مرة واحدة","مدة المباراة: 6 دقائق","صعوبة اللعب: Professional","ممنوع استخدام الفرق المخصصة"]},online:{info:["نظام الإقصاء المباشر","32 لاعب مشارك","مدة البطولة: 3 أيام","اللعب عبر الإنترنت"],prizes:["البطل: 8,000 ريال","الوصيف: 4,000 ريال","المركز الثالث: 2,000 ريال","المركز الرابع: 1,000 ريال"],rules:["من يخسر يخرج من البطولة","مدة المباراة: 6 دقائق","صعوبة اللعب: World Class","يُسمح بجميع الفرق"]},offline:{info:["نظام الإقصاء المباشر","16 لاعب مشارك","مدة البطولة: يوم واحد","المكان: الرياض - مركز الألعاب"],prizes:["البطل: 15,000 ريال","الوصيف: 7,500 ريال","المركز الثالث: 3,000 ريال","المركز الرابع: 1,500 ريال"],rules:["من يخسر يخرج من البطولة","مدة المباراة: 6 دقائق","صعوبة اللعب: Legendary","فرق محددة فقط"]}}[e];document.getElementById("tournamentInfoInline").innerHTML="<ul>"+r.info.map(t=>`<li>${t}</li>`).join("")+"</ul>",document.getElementById("tournamentPrizesInline").innerHTML="<ul>"+r.prizes.map(t=>`<li>${t}</li>`).join("")+"</ul>",document.getElementById("tournamentRulesInline").innerHTML="<ul>"+r.rules.map(t=>`<li>${t}</li>`).join("")+"</ul>"}async function B(){if(i)try{const{data:e,error:n}=await i.from("league_standings").select("*").order("points",{ascending:!1}).order("goal_difference",{ascending:!1});if(n)throw n;const r=document.getElementById("tournamentStandingsInline");if(!e||e.length===0){r.innerHTML="<p>لا توجد بيانات حتى الآن</p>";return}r.innerHTML=`
            <div class="detailed-table">
                <h4>جدول ترتيب الدوري الممتاز</h4>
                <div class="table-container">
                    <table>
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
                            ${e.map((t,o)=>`
                                <tr>
                                    <td><strong>${o+1}</strong></td>
                                    <td><strong>${t.team_name}</strong></td>
                                    <td>${t.matches_played}</td>
                                    <td>${t.wins}</td>
                                    <td>${t.draws}</td>
                                    <td>${t.losses}</td>
                                    <td>${t.goals_for}</td>
                                    <td>${t.goals_against}</td>
                                    <td>${t.goal_difference>0?"+":""}${t.goal_difference}</td>
                                    <td><strong>${t.points}</strong></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        `}catch(e){console.error("Error loading detailed standings:",e)}}async function q(e){if(i)try{const{data:n,error:r}=await i.from("knockout_matches").select("*").eq("tournament_type",e).order("round",{ascending:!0});if(r)throw r;const t=document.getElementById("tournamentStandingsInline");if(!n||n.length===0){t.innerHTML="<p>سيتم عرض شجرة البطولة عند بدء المباريات</p>";return}const o={};n.forEach(a=>{o[a.round]||(o[a.round]=[]),o[a.round].push(a)}),t.innerHTML=`
            <div class="detailed-table">
                <h4>شجرة ${e==="online"?"كأس فيفا الرقمي":"بطولة الأبطال الحضورية"}</h4>
                <div class="bracket-container">
                    ${Object.keys(o).map(a=>`
                        <div class="bracket-round">
                            <h5>الجولة ${a}</h5>
                            <div class="bracket-matches">
                                ${o[a].map(s=>`
                                    <div class="bracket-match">
                                        <div class="bracket-team ${s.team1_score>s.team2_score?"winner":s.team2_score>s.team1_score?"loser":""}">
                                            ${s.team1_name} ${s.team1_score!==null?s.team1_score:""}
                                        </div>
                                        <div class="vs">VS</div>
                                        <div class="bracket-team ${s.team2_score>s.team1_score?"winner":s.team1_score>s.team2_score?"loser":""}">
                                            ${s.team2_name} ${s.team2_score!==null?s.team2_score:""}
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}catch(n){console.error("Error loading detailed bracket:",n)}}async function N(e){if(i)try{let n,r;if(e==="league"?{data:n,error:r}=await i.from("league_matches").select("*").order("match_date",{ascending:!1}):{data:n,error:r}=await i.from("knockout_matches").select("*").eq("tournament_type",e).order("match_date",{ascending:!1}),r)throw r;const t=document.getElementById("tournamentMatchesInline");if(!n||n.length===0){t.innerHTML="<p>لا توجد مباريات حتى الآن</p>";return}t.innerHTML=`
            <div class="detailed-table">
                <h4>المباريات</h4>
                <div class="match-list">
                    ${n.map(o=>`
                        <div class="match-item">
                            <div class="match-info">
                                <div class="match-teams">${o.team1_name} VS ${o.team2_name}</div>
                                <div class="match-date">${new Date(o.match_date).toLocaleDateString("ar-SA")}</div>
                            </div>
                            <div class="match-score">
                                ${o.team1_score!==null?`${o.team1_score} - ${o.team2_score}`:"لم تحدد"}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `}catch(n){console.error("Error loading tournament matches:",n)}}function H(e){const r={league:[{day:"الأسبوع الأول",matches:[{time:"19:00",teams:"الأهلي VS الهلال",venue:"أونلاين"},{time:"20:00",teams:"النصر VS الاتحاد",venue:"أونلاين"},{time:"21:00",teams:"الشباب VS التعاون",venue:"أونلاين"}]},{day:"الأسبوع الثاني",matches:[{time:"19:00",teams:"الأهلي VS النصر",venue:"أونلاين"},{time:"20:00",teams:"الهلال VS الاتحاد",venue:"أونلاين"},{time:"21:00",teams:"الشباب VS التعاون",venue:"أونلاين"}]}],online:[{day:"اليوم الأول - دور الـ32",matches:[{time:"16:00",teams:"مباراة 1",venue:"أونلاين"},{time:"16:30",teams:"مباراة 2",venue:"أونلاين"},{time:"17:00",teams:"مباراة 3",venue:"أونلاين"}]},{day:"اليوم الثاني - دور الـ16",matches:[{time:"18:00",teams:"مباراة ربع النهائي 1",venue:"أونلاين"},{time:"18:30",teams:"مباراة ربع النهائي 2",venue:"أونلاين"}]}],offline:[{day:"صباح البطولة",matches:[{time:"09:00",teams:"دور الـ16 - مباراة 1",venue:"القاعة A"},{time:"09:30",teams:"دور الـ16 - مباراة 2",venue:"القاعة B"},{time:"10:00",teams:"دور الـ16 - مباراة 3",venue:"القاعة A"}]},{day:"مساء البطولة",matches:[{time:"18:00",teams:"نصف النهائي الأول",venue:"القاعة الرئيسية"},{time:"19:00",teams:"نصف النهائي الثاني",venue:"القاعة الرئيسية"},{time:"20:00",teams:"المباراة النهائية",venue:"القاعة الرئيسية"}]}]}[e],t=document.getElementById("tournamentScheduleInline");t.innerHTML=r.map(o=>`
        <div class="schedule-day">
            <h5>${o.day}</h5>
            <div class="schedule-matches">
                ${o.matches.map(a=>`
                    <div class="schedule-match">
                        <div class="schedule-time">${a.time}</div>
                        <div class="schedule-teams">${a.teams}</div>
                        <div class="schedule-venue">${a.venue}</div>
                    </div>
                `).join("")}
            </div>
        </div>
    `).join("")}function C(){b.style.display="none"}async function O(e){if(e.preventDefault(),console.log("📝 محاولة إرسال طلب تسجيل..."),!i){console.error("❌ قاعدة البيانات غير متصلة"),d("قاعدة البيانات غير متصلة","error");return}const n=e.target.querySelector('button[type="submit"]'),r=n.innerHTML;n.innerHTML='<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...',n.disabled=!0;const t=new FormData(m),o={player_name:t.get("playerName"),email:t.get("email"),phone:t.get("phone"),tournament_type:t.get("tournament"),experience_level:t.get("experience"),status:"pending"};console.log("📋 بيانات التسجيل:",o);try{const{data:a,error:s}=await i.from("registrations").insert([o]).select();if(s)throw console.error("❌ خطأ في إدراج البيانات:",s),s;console.log("✅ تم إرسال طلب التسجيل بنجاح:",a),d("تم إرسال طلب التسجيل بنجاح! سيتم مراجعته قريباً.","success"),m.reset(),await w()}catch(a){console.error("Error submitting registration:",a);let s="حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.";a.message&&(s+=`
التفاصيل: `+a.message),d(s,"error")}finally{n.innerHTML=r,n.disabled=!1}}async function j(){if(!i){console.warn("Supabase not initialized");return}try{await w()}catch(e){console.error("Error loading tournament data:",e)}}async function w(){try{const{data:e,error:n}=await i.from("registrations").select("tournament_type").eq("status","approved");if(n)throw n;const r={};e.forEach(t=>{r[t.tournament_type]=(r[t.tournament_type]||0)+1}),y("league",r.league||0,16),y("online",r.online||0,32),y("offline",r.offline||0,32)}catch(e){console.error("Error updating tournament statuses:",e)}}function y(e,n,r){const t=document.querySelectorAll(".tournament-selection-card");if(!t||t.length===0)return;const o=P(e)-1;if(o>=t.length)return;const s=t[o].querySelector(".status-badge");s&&(n>=r?(s.textContent="مغلق",s.className="status-badge closed"):n>0?(s.textContent="جاري اللعب",s.className="status-badge playing"):(s.textContent="مفتوح للتسجيل",s.className="status-badge open"))}function P(e){switch(e){case"league":return 1;case"online":return 2;case"offline":return 3;default:return 1}}function d(e,n){document.querySelectorAll(".message").forEach(o=>o.remove());const t=document.createElement("div");if(t.className=`message ${n}`,e.includes(`
`)){const o=e.split(`
`);t.innerHTML=o.map(a=>`<div>${a}</div>`).join("")}else t.textContent=e;document.body.appendChild(t),t.style.position="fixed",t.style.top="20px",t.style.right="20px",t.style.zIndex="9999",t.style.maxWidth="400px",t.style.boxShadow="0 4px 12px rgba(0,0,0,0.15)",setTimeout(()=>{t&&t.parentNode&&t.remove()},5e3)}document.addEventListener("click",function(e){e.target.closest(".play-button")&&alert("سيتم تشغيل المقطع قريباً")});function V(){document.querySelectorAll("button").forEach(n=>{n.addEventListener("click",function(){if(!this.classList.contains("loading")){const r=this.innerHTML;this.innerHTML='<span class="loading"></span> جاري التحميل...',this.classList.add("loading"),setTimeout(()=>{this.innerHTML=r,this.classList.remove("loading")},2e3)}})})}document.addEventListener("DOMContentLoaded",V);
