/*
#[test_only]
module game_reward::game_reward_tests;
// uncomment this line to import the module
// use game_reward::game_reward;

#[error(code = 0)]
const ENotImplemented: vector<u8> = b"Not Implemented";

#[test]
fun test_game_reward() {
    // pass
}

#[test, expected_failure(abort_code = ::game_reward::game_reward_tests::ENotImplemented)]
fun test_game_reward_fail() {
    abort ENotImplemented
}
*/
#[test_only]
module game_reward::game_tests {
    use sui::test_scenario;
    use game_reward::game_score::{Self, PlayerScore};
    use sui::clock;

    #[test]
    fun test_submit_score() {
        let admin = @0xAD;
        let player = @0xCAFE;
        let mut scenario = test_scenario::begin(admin);
        
        // 1. Giả lập tạo profile
        test_scenario::next_tx(&mut scenario, player);
        {
            game_score::create_score_profile(test_scenario::ctx(&mut scenario));
        };

        // 2. Giả lập gửi điểm
        test_scenario::next_tx(&mut scenario, player);
        {
            let mut score_obj = test_scenario::take_from_sender<PlayerScore>(&scenario);
            game_score::submit_score(&mut score_obj, 1500, test_scenario::ctx(&mut scenario));
            
            // Kiểm tra xem điểm có đúng là 1500 không
            assert!(game_score::get_best_score(&score_obj) == 1500, 1);
            test_scenario::return_to_sender(&scenario, score_obj);
        };
        test_scenario::end(scenario);
    }
}