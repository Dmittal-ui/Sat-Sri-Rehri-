// Punjab College Area Hyper-Local Guide
// Behaves like a senior college student with street food rehri knowledge

const punjabSlang = {
    "yrr": { meaning: "yaar (dost)", example: "Yrr, chole bhature khane chalte hain" },
    "yaar": { meaning: "dost", example: "Yaar, kahan milega achha khana?" },
    "bhai": { meaning: "bhai (casual address)", example: "Bhai, rehri kahan lagti hai?" },
    "oye": { meaning: "hey (bulane ke liye)", example: "Oye, golgappe kahan milenge?" },
    "scene": { meaning: "situation, kya chal raha hai", example: "Kya scene hai, khana milega?" },
    "pta": { meaning: "pata", example: "Mujhe pta nahi kahan milega" },
    "tenu": { meaning: "tujhe", example: "Tenu pata hai kahan rehri lagti hai?" },
    "sat sri akal": { meaning: "Sikh greeting", example: "Sat Sri Akal, kaise ho?" },
    "ki hal": { meaning: "kya haal hai", example: "Ki hal tuhada? Sab theek?" },
    "chakkar": { meaning: "ghumna, round", example: "College ke chakkar lagane hain" },
    "fuddu": { meaning: "bewakoof", example: "Fuddu mat ban, sach bata" }
};

class PunjabHyperLocalGuide {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.hasGreeted = false;
        this.lastShownTimeList = null;
        this.lastShownCategoryList = null;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleUserMessage());
        }
        if (this.userInput) {
            this.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserMessage();
            });
        }
    }
    
    handleUserMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + sender + '-message';
        messageDiv.innerHTML = '<p>' + text + '</p>';
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    generateResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        // Opening greeting
        if (!this.hasGreeted && (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('sat sri akal'))) {
            this.hasGreeted = true;
            return this.getWelcomeWithFoodList();
        }
        
        // Block restaurant/delivery/exact location queries
        if (this.isRestaurantQuery(lowerQuery)) {
            return "Bhai, main sirf college area ke rehri patterns jaanta hun - restaurants, delivery apps, ya exact locations nahi bata sakta. Local patterns ke base pe guide kar sakta hun.";
        }

        // RULE 6: Handle Punjabi slang & greetings
        const slangResponse = this.getPunjabiSlangResponse(lowerQuery);
        if (slangResponse) return slangResponse;

        // Handle Punjabi greetings
        if (lowerQuery.includes('ki haal') || lowerQuery.includes('ki hal')) {
            return "Sab theek hai yaar! 😊 Main Punjab college areas ke street food rehris ke baare mein bata sakta hun. Koi specific dish ya time puchho, main local patterns bataunga.";
        }

        // RULE 5: Handle confirmation words (ENHANCED POLITE HANDLING)
        if (this.isConfirmationWord(lowerQuery)) {
            return this.getPoliteConfirmationResponse();
        }

        // RULE 1: Handle time-only inputs
        if (this.isTimeOnlyQuery(lowerQuery)) {
            return this.getTimeBasedFoodList(lowerQuery);
        }

        // UNIVERSAL DISH DETAIL HANDLING (HIGHEST PRIORITY)
        // For ANY specific dish name, provide local guidance with mandatory structure
        if (this.isSpecificDishQuery(lowerQuery)) {
            this.lastShownTimeList = null;
            this.lastShownCategoryList = null;
            return this.getUniversalDishResponse(lowerQuery);
        }

        // RULE 3: Handle partial or broad food inputs (UNIVERSAL)
        if (this.isPartialFoodInput(lowerQuery)) {
            return this.getPartialFoodResponse(lowerQuery);
        }
        
        // Show food list when user is unsure
        if (this.isUnsureQuery(lowerQuery)) {
            return this.getSuggestedFoodList();
        }
        
        // SOFT HUMAN FALLBACK - only for truly unclear/unrelated input
        return "Samajh nahi aaya thoda 😊  Aloo tikki, rajma chawal ya sirf 'evening' likh ke try karo.";
    }

    isRestaurantQuery(query) {
        const forbidden = [
            'restaurant', 'zomato', 'swiggy', 'delivery', 'app', 'order', 'online',
            'exact location', 'address', 'gps', 'map', 'distance', 'directions',
            'dominos', 'pizza hut', 'kfc', 'mcdonalds', 'subway', 'chain'
        ];
        return forbidden.some(keyword => query.includes(keyword));
    }

    isUnsureQuery(query) {
        const unsurePatterns = [
            'what', 'kya', 'help', 'guide', 'suggest', 'recommend', 'options', 'list',
            'confused', 'don\'t know', 'nahi pata', 'kuch bhi', 'anything', 'batao',
            'kya khaun', 'kya milta hai', 'kya available hai', 'show me', 'dikhao'
        ];
        return unsurePatterns.some(pattern => query.includes(pattern));
    }

    isConfirmationWord(query) {
        const confirmationWords = ['ok', 'okay', 'haan', 'hnji', 'yes', 'fine', 'theek hai', 'thik hai', 'achha', 'accha', 'good', 'right'];
        const lowerQuery = query.toLowerCase().trim();
        
        return confirmationWords.some(word => {
            return lowerQuery === word || lowerQuery === word + ' ji';
        });
    }

    getPoliteConfirmationResponse() {
        // CASE 1: AFTER A FOOD LIST WAS JUST SHOWN
        if (this.lastShownCategoryList || this.lastShownTimeList) {
            return this.getActiveListConfirmationResponse();
        }
        
        // CASE 2: CASUAL CONFIRMATION (NO ACTIVE LIST)
        return "Dhanwad 🙏 Waheguru ji.\nJab mann ho, food ya Punjabi slang puch lena.";
    }

    getActiveListConfirmationResponse() {
        // Handle confirmation after category/ingredient lists
        if (this.lastShownCategoryList) {
            return this.getCategoryConfirmationResponse();
        }
        
        // Handle confirmation after time-based lists
        if (this.lastShownTimeList) {
            return this.getTimeConfirmationResponse();
        }
        
        return "Koi specific food item ya time puchho, main local patterns bata dunga!";
    }

    getCategoryConfirmationResponse() {
        const category = this.lastShownCategoryList;
        
        if (category === 'aloo') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Aloo Tikki • Aloo Paratha • Aloo Gobi • Aloo Baingan\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'paneer') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Paneer Tikka • Palak Paneer • Matar Paneer • Paneer Sabzi\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'dal') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Dal Chawal • Dal Makhani • Langar-style Dal\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'chole') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Chole Bhature • Chole Kulche • Chole Chawal • Amritsari Chole\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'rajma') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Rajma Chawal • Rajma Masala • Rajma Rice\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'chicken') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Butter Chicken • Chicken Tikka • Tandoori Chicken • Achari Chicken • Chicken Curry\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'paratha') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Aloo Paratha • Paneer Paratha • Anda Paratha • Gobi Paratha\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'rice') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Rajma Chawal • Kadhi Chawal • Dal Chawal\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'veg') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Rajma Chawal • Chole Bhature • Aloo Tikki • Kadhi Chawal • Aloo Paratha • Golgappe\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'nonveg') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Chicken Tikka • Butter Chicken • Tandoori Chicken • Anda Paratha • Chicken Momos\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (category === 'snacks') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Aloo Tikki • Golgappe • Samosa • Chaat • Momos • Pakora\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        // Generic fallback for other categories
        return 'Thik hai ji 👍\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
    }

    getTimeConfirmationResponse() {
        if (this.lastShownTimeList === 'morning') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Poha • Chai • Samosa • Bread Pakora • Chole Kulche • Omelette\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (this.lastShownTimeList === 'afternoon') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Rajma Chawal • Chole Bhature • Kadhi Chawal • Dal Chawal • Dal Makhani\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (this.lastShownTimeList === 'evening') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Aloo Tikki • Golgappe • Tikki Chaat • Papdi Chaat • Momos • Chowmein\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        if (this.lastShownTimeList === 'night') {
            return 'Thik hai ji 👍\n\n**Yeh options hain:**\n• Maggi • Paratha • Anda Paratha • Chai\n\nKisi ek item ka naam likho, main local rehri pattern bata dunga.';
        }
        
        return "Koi specific food item puchho, main local patterns bata dunga!";
    }

    isTimeOnlyQuery(query) {
        const timeWords = ['morning', 'afternoon', 'evening', 'night', 'late night', 'midnight', 'subah', 'dopahar', 'shaam', 'raat'];
        const lowerQuery = query.toLowerCase().trim();
        
        return timeWords.some(timeWord => {
            const timePattern1 = new RegExp('^' + timeWord + '$', 'i');
            const timePattern2 = new RegExp('^in ' + timeWord + '$', 'i');
            const timePattern3 = new RegExp('^' + timeWord + ' time$', 'i');
            const timePattern4 = new RegExp('^' + timeWord + ' mein$', 'i');
            return timePattern1.test(lowerQuery) || timePattern2.test(lowerQuery) || timePattern3.test(lowerQuery) || timePattern4.test(lowerQuery);
        });
    }

    getTimeBasedFoodList(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('morning') || lowerQuery.includes('subah')) {
            this.lastShownTimeList = 'morning';
            this.lastShownCategoryList = null;
            return '**Morning (7–10 AM) mein yeh items usually milte hain:**\n\n• Poha\n• Chai\n• Samosa\n• Bread Pakora\n• Chole Kulche\n• Omelette / Anda Bread\n\n*Yeh list local patterns ke base pe hai, guaranteed availability nahi hai.*\n\n**Koi specific item select karo details ke liye!**';
        }
        
        if (lowerQuery.includes('afternoon') || lowerQuery.includes('dopahar')) {
            this.lastShownTimeList = 'afternoon';
            this.lastShownCategoryList = null;
            return '**Afternoon (12–3 PM) mein yeh items usually milte hain:**\n\n• Rajma Chawal\n• Chole Bhature\n• Kadhi Chawal\n• Dal Chawal\n• Dal Makhani\n\n*Yeh list local patterns ke base pe hai, guaranteed availability nahi hai.*\n\n**Koi specific item select karo details ke liye!**';
        }
        
        if (lowerQuery.includes('evening') || lowerQuery.includes('shaam')) {
            this.lastShownTimeList = 'evening';
            this.lastShownCategoryList = null;
            return '**Evening (5–8 PM) mein yeh items usually milte hain:**\n\n• Aloo Tikki\n• Golgappe\n• Tikki Chaat\n• Papdi Chaat\n• Momos\n• Chowmein\n\n*Yeh list local patterns ke base pe hai, guaranteed availability nahi hai.*\n\n**Koi specific item select karo details ke liye!**';
        }
        
        if (lowerQuery.includes('night') || lowerQuery.includes('late night') || lowerQuery.includes('midnight') || lowerQuery.includes('raat')) {
            this.lastShownTimeList = 'night';
            this.lastShownCategoryList = null;
            return '**Night / Late Night (After 9 PM) mein yeh items usually milte hain:**\n\n• Maggi\n• Paratha\n• Anda Paratha\n• Chai\n\n*Yeh list local patterns ke base pe hai, guaranteed availability nahi hai.*\n\n**Koi specific item select karo details ke liye!**';
        }
        
        return null;
    }

    isSpecificDishQuery(query) {
        const specificDishes = [
            // Breakfast items
            'poha', 'samosa', 'bread pakora', 'chole kulche', 'omelette', 'anda bread', 'paratha', 'aloo paratha', 'paneer paratha', 'gobi paratha',
            // Main meals
            'rajma chawal', 'chole bhature', 'kadhi chawal', 'dal chawal', 'dal makhani', 'rajma', 'chole', 'kadhi',
            // Evening snacks
            'aloo tikki', 'golgappe', 'pani puri', 'tikki chaat', 'papdi chaat', 'momos', 'chowmein', 'pakora', 'bhel puri',
            // Night items
            'maggi', 'anda paratha', 'butter toast',
            // Drinks
            'chai', 'tea', 'lassi', 'chaas', 'shikanjvi', 'cold drink', 'nimbu paani',
            // Non-veg items
            'chicken tikka', 'tandoori chicken', 'butter chicken', 'achari chicken', 'chicken curry', 'chicken momos', 'egg curry', 'anda curry',
            // Vegetarian dishes
            'paneer tikka', 'palak paneer', 'matar paneer', 'paneer sabzi', 'aloo gobi', 'bhindi masala', 'baingan bharta',
            // Rice dishes
            'veg rice', 'chicken rice', 'fried rice',
            // Sweets and desserts
            'kheer', 'phirni', 'gajar halwa', 'kulfi', 'jalebi', 'gulab jamun',
            // Additional popular items
            'dosa', 'idli', 'vada', 'uttapam', 'pav bhaji', 'misal pav', 'sandwich', 'grilled sandwich', 'pizza', 'burger'
        ];
        
        return specificDishes.some(dish => query.includes(dish));
    }

    getUniversalDishResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        // BREAKFAST ITEMS (7-10 AM)
        if (lowerQuery.includes('poha')) {
            return "Poha usually morning (7-10 AM) mein college gate ke aas-paas milta hai, kyunki us time students zyada nikalte hain. Light breakfast hai, vendors covered spots dhundte hain agar weather kharab ho. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('chai') || lowerQuery.includes('tea')) {
            return "Chai usually morning (7-10 AM) aur evening (5-8 PM) mein college gate, hostel road aur tuition area ke aas-paas milti hai, kyunki us time students ki demand zyada hoti hai. Rain ho to stalls covered spots mein shift ho jaate hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('samosa')) {
            return "Samosa usually morning (7-10 AM) aur evening (5-8 PM) mein college gate aur market side ke aas-paas milta hai, kyunki us time students snacks prefer karte hain. Police checking ke time vendors thoda andar shift ho jaate hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('bread pakora')) {
            return "Bread pakora usually morning (7-10 AM) mein hostel road aur college gate ke aas-paas milta hai, kyunki us time students breakfast ke liye nikalte hain. Weather kharab ho to vendors covered area dhundte hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('omelette')) {
            return "Omelette usually morning (7-10 AM) mein hostel road aur outer road ke aas-paas milta hai, kyunki us time students protein breakfast prefer karte hain. Vendors gas stove ke saath setup karte hain, rain mein problem hoti hai. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // MAIN MEALS (12-3 PM)
        if (lowerQuery.includes('rajma chawal') || (lowerQuery.includes('rajma') && !lowerQuery.includes('tikka'))) {
            return "Rajma chawal usually afternoon (12-3 PM) mein market side ya college outer road ke aas-paas milta hai, kyunki us time students heavy meal demand karte hain lunch break mein. Evening police checking ke time rehri thodi andar shift ho sakti hai. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('chole bhature') || (lowerQuery.includes('chole') && !lowerQuery.includes('kulche'))) {
            return "Chole bhature usually afternoon (12-3 PM) mein market side aur college outer road ke aas-paas milta hai, kyunki us time students heavy Punjabi meal prefer karte hain. Bhature fresh banane ke liye vendors setup time lete hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('dal chawal') || (lowerQuery.includes('dal') && lowerQuery.includes('chawal'))) {
            return "Dal chawal usually afternoon (12-3 PM) mein hostel road aur market side ke aas-paas milta hai, kyunki us time students simple, filling meal chahte hain. Vendors dal fresh banate hain, quantity ke hisaab se availability hoti hai. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('kadhi chawal') || (lowerQuery.includes('kadhi') && !lowerQuery.includes('pakora'))) {
            return "Kadhi chawal usually afternoon (12-3 PM) mein market side aur college outer road ke aas-paas milta hai, kyunki us time students Punjabi comfort food prefer karte hain. Kadhi fresh banani padti hai, isliye limited quantity hoti hai. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // EVENING SNACKS (5-8 PM)
        if (lowerQuery.includes('aloo tikki') || lowerQuery.includes('tikki')) {
            return "Aloo tikki usually evening (5-8 PM) mein hostel road ya college back gate ke aas-paas milti hai, kyunki us time students classes ke baad snacks chahte hain. Evening police checking ke time rehri thodi andar shift ho sakti hai. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('golgappe') || lowerQuery.includes('pani puri')) {
            return "Golgappe usually evening (5-8 PM) mein hostel road aur tuition area ke aas-paas lagte hain, kyunki us time students ka hangout time hota hai classes ke baad. Evening police checking common hai, vendors inner gali mein shift ho jaate hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('momos')) {
            return "Momos usually evening (5-8 PM) mein hostel side aur college back gate ke aas-paas milte hain, kyunki us time students Chinese food prefer karte hain classes ke baad. Weather kharab ho to stalls covered area mein shift ho jaate hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('chowmein')) {
            return "Chowmein usually evening (5-8 PM) mein tuition area aur hostel road ke aas-paas milti hai, kyunki us time students fast Chinese food chahte hain. Vendors tawa setup karte hain, crowd ke hisaab se timing adjust karte hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // NIGHT ITEMS (9-11 PM)
        if (lowerQuery.includes('maggi')) {
            return "Maggi usually night (9-11 PM) mein hostel side aur PG areas ke aas-paas milti hai, kyunki us time mess band hone ke baad late hunger lagti hai students ko. Rain reduces availability kyunki outdoor cooking mushkil ho jaati hai. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('anda paratha') || (lowerQuery.includes('paratha') && lowerQuery.includes('anda'))) {
            return "Anda paratha usually night (9-11 PM) mein hostel road aur outer road ke aas-paas milta hai, kyunki us time students protein-rich dinner chahte hain. Vendors tawa aur gas setup karte hain, weather dependent hota hai. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        if (lowerQuery.includes('paratha') && !lowerQuery.includes('anda') && !lowerQuery.includes('aloo') && !lowerQuery.includes('paneer')) {
            return "Paratha usually morning (7-10 AM) aur night (9-11 PM) mein hostel road aur college gate ke aas-paas milta hai, kyunki us time students filling meal chahte hain. Vendors different stuffing ke saath banate hain, fresh tawa setup karte hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // DRINKS
        if (lowerQuery.includes('lassi')) {
            return "Lassi usually afternoon (12-3 PM) aur evening (5-8 PM) mein market side aur college gate ke aas-paas milti hai, kyunki us time students cooling drink chahte hain. Summer mein demand zyada hoti hai, vendors ice aur fresh dahi use karte hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // NON-VEG ITEMS (Usually not available on rehris, suggest alternatives)
        if (lowerQuery.includes('butter chicken') || lowerQuery.includes('chicken tikka') || lowerQuery.includes('tandoori chicken')) {
            return "Yeh dish rehri pe usually nahi milti kyunki tandoor aur proper setup chahiye. Evening (5-8 PM) mein students momos (chicken) ya chowmein try karte hain tuition area pe jo realistic options hain. Non-veg options limited hote hain college areas mein. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // PANEER DISHES (Usually not available on rehris, suggest alternatives)
        if (lowerQuery.includes('paneer tikka') || lowerQuery.includes('palak paneer') || lowerQuery.includes('matar paneer')) {
            return "Yeh dish rehri pe usually nahi milti kyunki proper cooking setup chahiye. Afternoon (12-3 PM) mein students dal chawal ya rajma chawal try karte hain market side pe jo realistic options hain. Paneer dishes rehri pe rare hote hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // SWEETS
        if (lowerQuery.includes('kulfi')) {
            return "Kulfi usually evening (5-8 PM) mein college gate aur market side ke aas-paas milti hai, kyunki us time students dessert chahte hain. Summer mein demand zyada hoti hai, vendors ice box ke saath setup karte hain. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
        }
        
        // GENERIC FALLBACK FOR RECOGNIZED DISHES
        return "Yeh dish usually college areas mein milti hai, lekin time aur location vary karta hai. Morning breakfast, afternoon lunch, ya evening snacks ke time different areas mein check karo - college gate, hostel road, market side. Availability daily change ho sakti hai, isliye nearby students ya guards se confirm karna better hota hai.";
    }

    isPartialFoodInput(query) {
        const foodWords = [
            'aloo', 'paneer', 'dal', 'chole', 'rajma', 'kadhi', 'gobi', 'palak', 'matar',
            'bhindi', 'baingan', 'lauki', 'karela', 'gajar', 'pyaz', 'tamatar',
            'chicken', 'murgh', 'keema', 'fish', 'egg', 'anda', 'mutton', 'gosht',
            'rice', 'chawal', 'paratha', 'roti', 'naan', 'kulcha', 'bhatura', 'makki',
            'veg', 'nonveg', 'non-veg', 'vegetarian', 'sweets', 'mithai', 'drinks', 'beverages',
            'tikka', 'curry', 'sabzi', 'fry', 'masala', 'tandoori', 'butter',
            'snacks', 'breakfast', 'lunch', 'dinner', 'food', 'khana',
            'dahi', 'lassi', 'milk', 'doodh', 'ghee', 'oil'
        ];
        
        const lowerQuery = query.toLowerCase().trim();
        
        return foodWords.some(word => {
            return lowerQuery === word || 
                   lowerQuery === word + ' food' || 
                   lowerQuery === word + ' items' || 
                   lowerQuery === word + ' dishes' ||
                   lowerQuery === word + ' ki sabzi' ||
                   lowerQuery === word + ' wala';
        });
    }

    getPartialFoodResponse(query) {
        const lowerQuery = query.toLowerCase().trim();
        
        this.lastShownTimeList = null;
        
        if (lowerQuery.includes('aloo')) {
            this.lastShownCategoryList = 'aloo';
            return 'Samjha 👍\n\n**Aloo se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Aloo Tikki\n• Aloo Paratha\n• Aloo Gobi\n• Aloo Baingan\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('paneer')) {
            this.lastShownCategoryList = 'paneer';
            return 'Samjha 👍\n\n**Paneer se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Paneer Tikka\n• Palak Paneer\n• Matar Paneer\n• Paneer Sabzi\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('dal')) {
            this.lastShownCategoryList = 'dal';
            return 'Samjha 👍\n\n**Dal se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Dal Chawal\n• Dal Makhani\n• Langar-style Dal\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('chole')) {
            this.lastShownCategoryList = 'chole';
            return 'Samjha 👍\n\n**Chole se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Chole Bhature\n• Chole Kulche\n• Chole Chawal\n• Amritsari Chole\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('rajma')) {
            this.lastShownCategoryList = 'rajma';
            return 'Samjha 👍\n\n**Rajma se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Rajma Chawal\n• Rajma Masala\n• Rajma Rice\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('chicken') || lowerQuery.includes('murgh')) {
            this.lastShownCategoryList = 'chicken';
            return 'Samjha 👍\n\n**Chicken se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Butter Chicken\n• Chicken Tikka\n• Tandoori Chicken\n• Achari Chicken\n• Chicken Curry\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('rice') || lowerQuery.includes('chawal')) {
            this.lastShownCategoryList = 'rice';
            return 'Samjha 👍\n\n**Rice se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Rajma Chawal\n• Kadhi Chawal\n• Dal Chawal\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('paratha')) {
            this.lastShownCategoryList = 'paratha';
            return 'Samjha 👍\n\n**Paratha se Punjab college areas mein students usually yeh dishes bolte hain:**\n• Aloo Paratha\n• Paneer Paratha\n• Anda Paratha\n• Gobi Paratha\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('veg') || lowerQuery.includes('vegetarian')) {
            this.lastShownCategoryList = 'veg';
            return 'Samjha 👍\n\n**Veg dishes mein Punjab college areas mein students usually yeh bolte hain:**\n• Rajma Chawal\n• Chole Bhature\n• Aloo Tikki\n• Kadhi Chawal\n• Aloo Paratha\n• Golgappe\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('nonveg') || lowerQuery.includes('non-veg')) {
            this.lastShownCategoryList = 'nonveg';
            return 'Samjha 👍\n\n**Non-veg dishes mein Punjab college areas mein students usually yeh bolte hain:**\n• Chicken Tikka\n• Butter Chicken\n• Tandoori Chicken\n• Anda Paratha\n• Chicken Momos\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('snacks')) {
            this.lastShownCategoryList = 'snacks';
            return 'Samjha 👍\n\n**Snacks mein Punjab college areas mein students usually yeh bolte hain:**\n• Aloo Tikki\n• Golgappe\n• Samosa\n• Chaat\n• Momos\n• Pakora\n\nKisi ek dish ka naam likho, main bataunga kis time aur kis type ke area mein rehri pe yeh realistic hota hai.';
        }
        
        if (lowerQuery.includes('food') || lowerQuery.includes('khana')) {
            return this.getSuggestedFoodList();
        }
        
        return null;
    }

    getFoodResponse(query) {
        if (query.includes('poha')) {
            return "Poha morning (7-10 AM) mein college gate aur main road corners pe milta hai. Light breakfast hai, students prefer karte hain. Weather kharab ho to vendors covered spots dhundte hain. Early students se puch lena.";
        }
        
        if (query.includes('chai') || query.includes('tea')) {
            return "Chai morning (7-10 AM) aur evening (5-8 PM) mein college gate, hostel side, tuition area - har jagah mil jaati hai. Students ki demand zyada hoti hai. Rain ho to stalls covered spots mein shift ho jaate hain. Kisi bhi student se puch lena, sab jaante hain.";
        }
        
        if (query.includes('rajma chawal') || query.includes('rajma')) {
            return "Rajma chawal usually afternoon (12-3 PM) mein market side ya college outer road ke paas milta hai. Heavy meal demand hoti hai lunch break mein. Evening police checking ke time rehri thodi andar shift ho sakti hai. Ghar se nikalne se pehle kisi student ya guard se confirm karna better hota hai.";
        }
        
        if (query.includes('aloo tikki') || query.includes('tikki')) {
            return "Aloo tikki usually evening (5-8 PM) mein hostel road ya college back gate ke paas milti hai. Evening police checking ke time rehri thodi andar shift ho sakti hai. Students ya guards se confirm karna better hota hai.";
        }
        
        if (query.includes('golgappe') || query.includes('pani puri')) {
            return "Golgappe evening (5-8 PM) mein hostel road aur tuition area ke paas lagte hain. Classes ke baad students ka hangout time hota hai. Evening police checking common hai, vendors inner gali mein shift ho jaate hain. Guards se confirm karna safe hota hai.";
        }
        
        if (query.includes('momos')) {
            return "Momos evening (5-8 PM) mein hostel side aur college back gate pe milte hain. Students Chinese food prefer karte hain classes ke baad. Weather kharab ho to stalls covered area mein shift ho jaate hain. Nearby students se location puch lena.";
        }
        
        if (query.includes('maggi')) {
            return "Maggi night (9-11 PM) mein hostel side aur PG areas mein milti hai. Mess band hone ke baad late hunger lagti hai. Rain reduces availability. Hostel ke guards ya seniors se puchna better hota hai location ke liye.";
        }
        
        if (query.includes('butter chicken')) {
            return "Butter chicken rehri pe usually nahi milta. Afternoon mein students rajma chawal ya chole bhature try karte hain, jo market side pe mil jata hai. Police checking ke time rehri thodi shift ho sakti hai. Students se alternatives puch lena better hai.";
        }
        
        if (query.includes('chicken tikka')) {
            return "Chicken tikka rehri pe usually nahi milta. Evening mein students momos (chicken) ya chowmein try karte hain tuition area pe. Non-veg options limited hote hain college areas mein. Police checking common hai evening mein. Guards se confirm karna safe hota hai.";
        }
        
        if (query.includes('paneer tikka')) {
            return "Paneer tikka rehri pe usually nahi milta (tandoor chahiye). Evening mein students aloo tikki ya tikki chaat try karte hain hostel road pe. Grilled items rehri pe rare hote hain. Nearby students se alternatives puch lena.";
        }
        
        return "Bhai, specific food name bata - main local rehri patterns ke hisaab se guide kar sakta hun. Time-based options try karo: morning, afternoon, evening, night. Students se confirm karna always safe hota hai.";
    }

    getWelcomeWithFoodList() {
        return '**Sat Sri Akal! 🙏 Punjab mein aapka swagat hai.**\n\nYeh guide Punjab college areas ke street food rehris ke baare mein batata hai — kaunsa khana usually milta hai aur kis time ke aas-paas.\n\n**Bas kisi dish ka naam likho (jaise aloo tikki, rajma chawal), ya time pucho (morning breakfast, evening snacks).**';
    }

    getSuggestedFoodList() {
        return '**👇 Shuru karne ke liye kuch select karo ya type karo:**\n\n🌅 **Morning (7–10 AM)**: Poha, Chai, Samosa, Bread Pakora\n🍛 **Afternoon (12–3 PM)**: Rajma Chawal, Chole Bhature, Kadhi Chawal\n🌮 **Evening (5–8 PM)**: Aloo Tikki, Golgappe, Momos, Chowmein\n🌙 **Night (After 9 PM)**: Maggi, Paratha, Chai\n🗣️ **Punjabi Slang**: yrr, scene, ki haal\n\nℹ️ Yeh sirf cultural guidance hai. Actual availability time, crowd, weather aur police checking pe depend karti hai.';
    }

    getPunjabiSlangResponse(query) {
        for (const slang in punjabSlang) {
            if (query.includes(slang)) {
                const info = punjabSlang[slang];
                return "'" + slang + "' ka matlab '" + info.meaning + "' hota hai.\nExample: " + info.example;
            }
        }
        
        if (query.includes('meaning') || query.includes('matlab') || query.includes('punjabi') || query.includes('word')) {
            return "Koi specific Punjabi college slang puchho, main uska meaning Hindi mein bata dunga. Try: yrr, oye, scene, bhai, ki hal.";
        }
        
        return null;
    }
}

// Initialize the Punjab Hyper-Local Guide
document.addEventListener('DOMContentLoaded', function() {
    new PunjabHyperLocalGuide();
});

// Function to fill input from example buttons
function fillInput(text) {
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.value = text;
        userInput.focus();
    }
}