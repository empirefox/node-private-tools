package front

type UserCashType int

const (
	TUserCashUnknown     UserCashType = iota // tr:"unknown"
	TUserCashPrepay                          // tr:"prepay"
	TUserCashPrepayBack                      // tr:"prepay back"
	TUserCashTrade                           // tr:"trade"
	TUserCashRefund                          // tr:"refund"
	TUserCashPreWithdraw                     // tr:"pre-withdraw"
	TUserCashWithdraw                        // tr:"withdraw"
	TUserCashReward                          // tr:"reward"
	TUserCashRebate                          // tr:"rebate"
	TUserCashRecharge                        // tr:"recharge"
)
