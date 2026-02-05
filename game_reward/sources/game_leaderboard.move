module game_reward::game_leaderboard {
    // Chỉ giữ lại những gì không được tự động import (nếu có)
    // Sui 2024 tự hiểu: tx_context, object, transfer, vector, option

    public struct LeaderboardEntry has store, drop, copy {
        player: address,
        score: u64,
    }

    public struct Leaderboard has key {
        id: UID,
        top_scores: vector<LeaderboardEntry>,
        max_entries: u64,
    }

    fun init(ctx: &mut TxContext) {
        let leaderboard = Leaderboard {
            id: object::new(ctx),
            top_scores: vector::empty(),
            max_entries: 10,
        };
        transfer::share_object(leaderboard);
    }

    public fun update_leaderboard(
        leaderboard: &mut Leaderboard,
        player: address,
        score: u64
    ) {
        let new_entry = LeaderboardEntry { player, score };
        let n = leaderboard.top_scores.length();
        let mut i = 0;
        let mut inserted = false;

        while (i < n) {
            let entry = &leaderboard.top_scores[i];
            if (score > entry.score) {
                leaderboard.top_scores.insert(new_entry, i);
                inserted = true;
                break
            };
            i = i + 1;
        };

        if (!inserted && n < leaderboard.max_entries) {
            leaderboard.top_scores.push_back(new_entry);
        };

        if (leaderboard.top_scores.length() > leaderboard.max_entries) {
            leaderboard.top_scores.pop_back();
        };
    }
}