module game_reward::game_score {

    public struct PlayerScore has key {
        id: UID,
        owner: address,
        best_score: u64,
        last_claim_timestamp: u64,
    }
    public(package) fun update_claim_time(score_obj: &mut PlayerScore, now: u64) {
        score_obj.last_claim_timestamp = now;
    }

    public fun create_score_profile(ctx: &mut TxContext) {
        let sender = ctx.sender();
        let new_profile = PlayerScore {
            id: object::new(ctx),
            owner: sender,
            best_score: 0,
            last_claim_timestamp: 0, 
        };
        transfer::transfer(new_profile, sender);
    }

    public fun submit_score(current_score_obj: &mut PlayerScore, new_score: u64, ctx: &mut TxContext) {
        assert!(current_score_obj.owner == ctx.sender(), 0);
        if (new_score > current_score_obj.best_score) {
            current_score_obj.best_score = new_score;
        };
    }

    public fun get_best_score(score_obj: &PlayerScore): u64 { score_obj.best_score }
    public fun get_last_claim(score_obj: &PlayerScore): u64 { score_obj.last_claim_timestamp }
}