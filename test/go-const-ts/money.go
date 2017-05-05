package front

type UserCashType int

const (
	TUserCashUnknown     UserCashType = iota // translate: `zh:"类1" en:"unknown"` done


	TUserCashPrepay                          // ` zh:"类2"  en:"prepay" ` with space
	// other comment
	TUserCashPrepayBack                      // `zh:"类3" en:"prepay back"`
	TUserCashTrade                           // empty en `zh:"类4" en:""`
	TUserCashRefund                          // empty all `zh:"类5"`
	TUserCashPreWithdraw                     // `zh:"类6" en:"pre-withdraw"`
	TUserCashWithdraw                        // `zh:"类7" en:"withdraw"`
	TUserCashReward                          // `zh:"类8"`
	TUserCashRebate                          // `zh:"类9"`
	TUserCashRecharge                        // `zh:"类0" en:"recharge"`
)
