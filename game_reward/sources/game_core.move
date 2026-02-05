module game_reward::game_core {
    use sui::clock::{Clock};
    use sui::event;

    
    const EGamePaused: u64 = 0;
    const ESubmitTooFast: u64 = 1;


    public struct AdminCap has key { id: UID }

    public struct GlobalState has key {
        id: UID,
        is_paused: bool,
    }


    public struct PlayerTracker has key {
        id: UID,
        last_submit_ms: u64,
    }

    public struct ScoreEvent has copy, drop { player: address, score: u64 }

    fun init(ctx: &mut TxContext) {
        transfer::transfer(AdminCap { id: object::new(ctx) }, ctx.sender());
        transfer::share_object(GlobalState { id: object::new(ctx), is_paused: false });
    }


    
    public fun pause_game(_: &AdminCap, state: &mut GlobalState) {
        state.is_paused = true;
    }

    public fun unpause_game(_: &AdminCap, state: &mut GlobalState) {
        state.is_paused = false;
    }

    public fun is_paused(state: &GlobalState): bool {
        state.is_paused
    }

    public fun submit_and_update(
        state: &GlobalState,
        leaderboard: &mut game_reward::game_leaderboard::Leaderboard,  
        tracker: &mut PlayerTracker,
        lb_tracker: &mut game_reward::game_leaderboard::PlayerActionTracker,  
        treasury_cap: &mut sui::coin::TreasuryCap<game_reward::game_coin::GAME_COIN>,
        score: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let now = clock.timestamp_ms();
        
        assert!(!state.is_paused, EGamePaused);
        
        assert!(now - tracker.last_submit_ms >= 10000, ESubmitTooFast);
        tracker.last_submit_ms = now;

        game_reward::game_leaderboard::update_leaderboard(
            leaderboard,
            lb_tracker,
            treasury_cap,
            score,
            clock,
            ctx
        );

        event::emit(ScoreEvent { player: ctx.sender(), score });
    }

    public fun join_game(ctx: &mut TxContext) {
        transfer::transfer(
            PlayerTracker { 
                id: object::new(ctx), 
                last_submit_ms: 0 
            }, 
            ctx.sender()
        );
    }
    public fun get_last_submit_time(tracker: &PlayerTracker): u64 {
        tracker.last_submit_ms
    }
}
