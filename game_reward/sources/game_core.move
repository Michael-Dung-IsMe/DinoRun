module game_reward::game_core {
    use sui::clock::{Clock};
    use sui::event;
    use std::string::{Self, String}; // Thêm thư viện String

    // --- Errors ---
    const EGamePaused: u64 = 0;
    const ESubmitTooFast: u64 = 1;

    // --- Objects ---
    public struct AdminCap has key { id: UID }

    public struct GlobalState has key {
        id: UID,
        is_paused: bool,
    }

    public struct Leaderboard has key {
        id: UID,
        top_scores: vector<LeaderboardEntry>,
        max_entries: u64,
        last_reset_time: u64,
    }

    public struct LeaderboardEntry has store, drop, copy {
        player: address,
        score: u64,
        username: String, // Thêm username vào Entry để hiển thị tên Facebook
    }

    // NFT xác định thông tin cá nhân và chống Spam
    public struct DinoNFT has key {
        id: UID,
        last_submit_ms: u64,
        username: String, // Lưu tên của người chơi
    }

    // --- Events ---
    public struct ScoreEvent has copy, drop { player: address, score: u64, username: String }

    // --- Init ---
    fun init(ctx: &mut TxContext) {
        transfer::transfer(AdminCap { id: object::new(ctx) }, ctx.sender());
        transfer::share_object(GlobalState { id: object::new(ctx), is_paused: false });
        transfer::share_object(Leaderboard {
            id: object::new(ctx),
            top_scores: vector::empty(),
            max_entries: 10,
            last_reset_time: 0,
        });
    }

    // --- Hàm nộp điểm: Kết nối dữ liệu từ NFT vào Leaderboard ---
    public fun submit_and_update(
        state: &GlobalState,
        leaderboard: &mut Leaderboard,
        tracker: &mut DinoNFT,
        score: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = clock.timestamp_ms();
        
        // 1. Bảo mật
        assert!(!state.is_paused, EGamePaused);
        assert!(now - tracker.last_submit_ms >= 10000, ESubmitTooFast); 

        tracker.last_submit_ms = now;

        // 2. Cập nhật Leaderboard kèm theo Username  đã lưu gán cho người dùng ở NFT
        let entry = LeaderboardEntry { 
            player: ctx.sender(), 
            score, 
            username: tracker.username 
        };
        update_logic(leaderboard, entry);

        // 3. Bắn Event
        event::emit(ScoreEvent { 
            player: ctx.sender(), 
            score, 
            username: tracker.username 
        });
    }

    fun update_logic(l: &mut Leaderboard, new_e: LeaderboardEntry) {
        let mut i = 0;
        let n = l.top_scores.length();
        let mut inserted = false;
        while (i < n) {
            if (new_e.score > l.top_scores[i].score) {
                l.top_scores.insert(new_e, i);
                inserted = true;
                break
            };
            i = i + 1;
        };
        if (!inserted && n < l.max_entries) { l.top_scores.push_back(new_e); };
        if (l.top_scores.length() > l.max_entries) { l.top_scores.pop_back(); };
    }

    public fun join_game_with_facebook(
        fb_name_bytes: vector<u8>, 
        ctx: &mut TxContext
    ) {
        let tracker = DinoNFT { 
            id: object::new(ctx), 
            last_submit_ms: 0,
            username: string::utf8(fb_name_bytes) 
        };
        transfer::transfer(tracker, ctx.sender());
    }
}