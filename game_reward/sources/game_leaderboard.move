module game_reward::game_leaderboard {
    use sui::clock::{Clock};
    use sui::coin::{Self, TreasuryCap};
    use game_reward::game_coin::{GAME_COIN};

    // --- Mã lỗi (Error Codes) ---
    const ESubmitTooFast: u64 = 1;

    // --- Cấu trúc dữ liệu ---

    public struct LeaderboardEntry has store, drop, copy {
        player: address,
        score: u64,
    }

    public struct Leaderboard has key {
        id: UID,
        top_scores: vector<LeaderboardEntry>,
        max_entries: u64,
        last_reset_time: u64,
        reset_interval: u64,
    }

    /// Object này được gửi về ví người chơi để theo dõi Rate Limiting
    public struct PlayerActionTracker has key {
        id: UID,
        last_submit_time: u64,
    }

    // --- Hằng số cấu hình ---
    const REWARD_TOP_1: u64 = 5000;
    const REWARD_TOP_2: u64 = 3000;
    const REWARD_TOP_3: u64 = 1000;
    
    /// Cooldown giữa 2 lần nộp điểm (30 giây)
    const SUBMIT_COOLDOWN_MS: u64 = 30000; 

    // --- Hàm khởi tạo ---

    fun init(ctx: &mut TxContext) {
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            top_scores: vector::empty(),
            max_entries: 10,
            last_reset_time: 0, 
            reset_interval: 604800000, // 7 ngày tính bằng ms
        };
        transfer::share_object(leaderboard);
    }

    /// Người chơi gọi hàm này 1 lần duy nhất khi bắt đầu chơi game 
    /// để nhận Tracker chống spam (Nên gộp vào hàm Register)
    public fun create_tracker(ctx: &mut TxContext) {
        let tracker = PlayerActionTracker {
            id: object::new(ctx),
            last_submit_time: 0,
        };
        transfer::transfer(tracker, ctx.sender());
    }

    // --- Logic nội bộ ---

    fun distribute_rewards(
        leaderboard: &Leaderboard, 
        treasury_cap: &mut TreasuryCap<GAME_COIN>, 
        ctx: &mut TxContext
    ) {
        let n = leaderboard.top_scores.length();
        let mut i = 0;

        while (i < n && i < 3) {
            let entry = &leaderboard.top_scores[i];
            let amount = if (i == 0) { REWARD_TOP_1 } 
                        else if (i == 1) { REWARD_TOP_2 } 
                        else { REWARD_TOP_3 };

            let reward_coin = coin::mint(treasury_cap, amount, ctx);
            transfer::public_transfer(reward_coin, entry.player);
            
            i = i + 1;
        }
    }

    fun check_and_reset(
        leaderboard: &mut Leaderboard, 
        treasury_cap: &mut TreasuryCap<GAME_COIN>,
        clock: &Clock, 
        ctx: &mut TxContext
    ) {
        let now = clock.timestamp_ms();
        // Nếu lần đầu hoặc đã quá chu kỳ reset
        if (leaderboard.last_reset_time == 0) {
             leaderboard.last_reset_time = now;
        } else if (now - leaderboard.last_reset_time >= leaderboard.reset_interval) {
            distribute_rewards(leaderboard, treasury_cap, ctx);
            leaderboard.top_scores = vector::empty();
            leaderboard.last_reset_time = now;
        }
    }

    // --- Hàm thực thi chính ---

    public fun update_leaderboard(
        leaderboard: &mut Leaderboard,
        tracker: &mut PlayerActionTracker, // Thêm tracker để rate limit
        treasury_cap: &mut TreasuryCap<GAME_COIN>,
        score: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = clock.timestamp_ms();

        // 1. Kiểm tra Rate Limiting (Cooldown 30s)
        assert!(now - tracker.last_submit_time >= SUBMIT_COOLDOWN_MS, ESubmitTooFast);
        tracker.last_submit_time = now;

        // 2. Kiểm tra Reset và trao thưởng
        check_and_reset(leaderboard, treasury_cap, clock, ctx);

        // 3. Cập nhật Leaderboard
        let player_addr = ctx.sender();
        let new_entry = LeaderboardEntry { player: player_addr, score };
        
        let n = leaderboard.top_scores.length();
        let mut i = 0;
        let mut inserted = false;

        while (i < n) {
            let entry = &leaderboard.top_scores[i];
            // Nếu điểm mới cao hơn điểm tại vị trí i
            if (score > entry.score) {
                leaderboard.top_scores.insert(new_entry, i);
                inserted = true;
                break
            };
            i = i + 1;
        };

        // Nếu chưa được chèn và danh sách chưa đầy
        if (!inserted && n < leaderboard.max_entries) {
            leaderboard.top_scores.push_back(new_entry);
        };

        // Giới hạn số lượng phần tử
        if (leaderboard.top_scores.length() > leaderboard.max_entries) {
            leaderboard.top_scores.pop_back();
        };
    }
}