// ⚙️ إعدادات قاعدة البيانات - بطولات فيفا 26
// 🔧 تحديث بيانات قاعدة البيانات هنا

export const DATABASE_CONFIG = {
    // 🔗 رابط قاعدة البيانات Supabase
    SUPABASE_URL: 'https://fgoylqtdqhzduuezctrf.supabase.co',
    
    // 🔑 مفتاح API العام (Anon Key)
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnb3lscXRkcWh6ZHV1ZXpjdHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTc1OTksImV4cCI6MjA3NDQ5MzU5OX0.FPjgccBsg1MFD5ntRZSC4DOO-t9ClMLOzO3lq8aj4LQ',
    
    // 📊 معلومات المشروع
    PROJECT_INFO: {
        name: 'بطولات فيفا 26',
        version: '1.0.0',
        environment: 'production'
    },
    
    // 🏆 إعدادات البطولات
    TOURNAMENT_SETTINGS: {
        league: {
            name: 'بطولة الدوري الممتاز',
            maxParticipants: 16,
            type: 'league'
        },
        online: {
            name: 'كأس فيفا الرقمي',
            maxParticipants: 32,
            type: 'knockout'
        },
        offline: {
            name: 'بطولة الأبطال الحضورية',
            maxParticipants: 16,
            type: 'knockout'
        }
    },
    
    // 🔧 إعدادات الاتصال
    CONNECTION_SETTINGS: {
        timeout: 10000,
        retries: 3,
        enableLogging: true
    }
};

// 🎯 دالة للحصول على معرف المشروع
export function getProjectId() {
    return DATABASE_CONFIG.SUPABASE_URL.split('//')[1].split('.')[0];
}

// 🔍 دالة للتحقق من صحة الإعدادات
export function validateConfig() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = DATABASE_CONFIG;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('❌ بيانات قاعدة البيانات غير مكتملة في ملف config');
    }
    
    if (!SUPABASE_URL.includes('supabase.co')) {
        throw new Error('❌ رابط قاعدة البيانات غير صحيح');
    }
    
    return true;
}

// 📝 تعليمات التحديث
console.log(`
🔧 لتحديث بيانات قاعدة البيانات:
1. افتح ملف: config/database.js
2. حدث SUPABASE_URL برابط مشروعك
3. حدث SUPABASE_ANON_KEY بمفتاح API الخاص بك
4. احفظ الملف وحدث الصفحة

📍 المشروع الحالي: ${getProjectId()}
`);
