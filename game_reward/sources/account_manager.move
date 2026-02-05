module game_reward::account_manager {
    use std::string::{String};
    use sui::clock::{Clock};

    /// Lỗi khi người chơi đã có tài khoản
    const EAccountAlreadyExists: u64 = 0;

    public struct PlayerProfile has key, store {
        id: UID,
        username: String,
        created_at: u64,
        owner: address,
    }

    /// Hàm "Đăng ký" - Tạo một Profile gắn liền với ví
    public fun register_account(
        username: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        let profile = PlayerProfile {
            id: object::new(ctx),
            username: username,
            created_at: clock.timestamp_ms(),
            owner: sender,
        };

        // Chuyển Object về cho người chơi sở hữu (Owned Object)
        transfer::transfer(profile, sender);
    }

    /// Hàm "Kiểm tra" - Trả về tên người chơi
    public fun get_username(profile: &PlayerProfile): String {
        profile.username
    }
}