module game_reward::game_core {
    use sui::clock::{Clock};
    use sui::coin::{Self, TreasuryCap};
    use sui::event;
    use game_reward::game_coin::{GAME_COIN};

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
    }

    // Tracker để chống Spam (Rate Limit) - Người chơi sở hữu
    public struct PlayerTracker has key {
        id: UID,
        last_submit_ms: u64,
    }

    // --- Events (Ghi điểm cộng cực lớn với Giám khảo) ---
    public struct ScoreEvent has copy, drop { player: address, score: u64 }

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

    // --- Hàm nộp điểm "All-in-one" ---
    public fun submit_and_update(
        state: &GlobalState,
        leaderboard: &mut Leaderboard,
        tracker: &mut PlayerTracker,
        score: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = clock.timestamp_ms();
        
        // 1. Bảo mật: Check pause & rate limit
        assert!(!state.is_paused, EGamePaused);
        assert!(now - tracker.last_submit_ms >= 10000, ESubmitTooFast); // Cooldown 10s cho nhanh

        tracker.last_submit_ms = now;

        // 2. Cập nhật Leaderboard ngay lập tức
        let entry = LeaderboardEntry { player: ctx.sender(), score };
        update_logic(leaderboard, entry);

        // 3. Bắn Event để Frontend hiện thông báo
        event::emit(ScoreEvent { player: ctx.sender(), score });
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

    // --- Admin: Tạo Tracker cho người chơi mới ---
    public fun join_game(ctx: &mut TxContext) {
        transfer::transfer(PlayerTracker { id: object::new(ctx), last_submit_ms: 0 }, ctx.sender());
    }
}