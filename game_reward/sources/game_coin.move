module game_reward::game_coin {
    use sui::coin::{Self, TreasuryCap};
    public struct GAME_COIN has drop {}

    #[allow(deprecated_usage)] // Tắt cảnh báo trình biên dịch
    fun init(witness: GAME_COIN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness, 
            9,                  
            b"GAME",            
            b"Game Coin",       
            b"Hackathon Game Reward",   
            option::none(),     
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, ctx.sender());
    }

    public fun mint(
        treasury_cap: &mut TreasuryCap<GAME_COIN>, 
        amount: u64, 
        recipient: address, 
        ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}
