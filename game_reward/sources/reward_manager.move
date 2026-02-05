module game_reward::reward_manager {
    use sui::coin::TreasuryCap;
    use sui::clock::{Self, Clock};
    use game_reward::game_score::{Self, PlayerScore};
    use game_reward::game_coin::{Self, GAME_COIN};

    const MIN_SCORE_FOR_REWARD: u64 = 1000;
    const REWARD_AMOUNT: u64 = 50_000_000_000; 
    const ONE_DAY_MS: u64 = 86_400_000; 

    const ENotEnoughScore: u64 = 1;
    const EClaimTooFast: u64 = 2;

    /// Loại bỏ 'entry' để tăng tính linh hoạt (PTB vẫn gọi được hàm public)
    public fun claim_reward_secure(
        score_obj: &mut PlayerScore,
        treasury_cap: &mut TreasuryCap<GAME_COIN>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = clock::timestamp_ms(clock);
        
        // 1. Kiểm tra điểm
        let current_best_score = game_score::get_best_score(score_obj);
        assert!(current_best_score >= MIN_SCORE_FOR_REWARD, ENotEnoughScore);

        // 2. Kiểm tra thời gian (Anti-Cheat 24h)
        let last_claim = game_score::get_last_claim(score_obj);
        assert!(now >= last_claim + ONE_DAY_MS, EClaimTooFast);

        // 3. Cập nhật trạng thái
        game_score::update_claim_time(score_obj, now);

        // 4. Trả thưởng
        game_coin::mint(treasury_cap, REWARD_AMOUNT, ctx.sender(), ctx);
    }
}