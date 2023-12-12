export const STATUS_MAP = {
  [true]: 'Kích hoạt',
  [false]: 'Vô hiệu hóa',
};

export const TRANSACTION_TYPE_MAP = {
  GIFT_SENT: 'Tặng quà',
  REWARD_FROM_GIFT: 'Phần thưởng từ quà',
  REWARD_FROM_STORY: 'Phần thưởng từ truyện',
  CHAPTER_BOUGHT: 'Mua chương',
  REFUND: 'Hoàn tiền',
  PURCHASE: 'Mua xu',
  DAILY_REWARD: 'Nhận xu hàng ngày',
  WITHDRAW: 'Rút tiền',
};
export const TRANSACTION_STATUS_MAP = {
  SUCCEEDED: 'Thành công',
  PROCESSING: 'Đang xử lý',
  FAILED: 'Thất bại',
};
