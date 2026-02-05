module game_reward::game_coin {
    use sui::coin::{Self, TreasuryCap};
    // Sử dụng thêm trait/function từ coin_registry
    // Lưu ý: Tùy phiên bản framework, có thể bạn cần dùng sui::token hoặc giữ nguyên coin::create_currency
    // nhưng gắn thêm attribute suppress nếu version framework của Hackathon chưa update kịp Registry.

    public struct GAME_COIN has drop {}

    #[allow(deprecated_usage)] // Cách 1: Tạm thời cho phép nếu bạn muốn code chạy ngay mà không đổi logic
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

// module game_reward::game_coin {
//     use sui::coin::{Self, TreasuryCap};

//     /// One-Time Witness: Tên phải trùng với tên module (viết hoa)
//     public struct GAME_COIN has drop {}

//     fun init(witness: GAME_COIN, ctx: &mut TxContext) {
//         let (treasury, metadata) = coin::create_currency(
//             witness, 
//             9,                  
//             b"GAME",            
//             b"Game Coin",       
//             b"Hackathon Game Reward",   
//             option::none(),     
//             ctx
//         );
//         transfer::public_freeze_object(metadata);
//         transfer::public_transfer(treasury, ctx.sender());
//     }

//     public fun mint(
//         treasury_cap: &mut TreasuryCap<GAME_COIN>, 
//         amount: u64, 
//         recipient: address, 
//         ctx: &mut TxContext
//     ) {
//         coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
//     }
// }