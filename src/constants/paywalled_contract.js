import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'






const CONTRACT_TERMS = [
    {
        title: 'Chấp nhận các điều khoản',
        contents: ['Bằng cách sử dụng Audiory ("Ứng dụng") và chấp nhận các điều khoản và điều kiện này ("Thỏa thuận"), bạn ("Tác giả") đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của Thỏa thuận này, vui lòng không sử dụng Ứng dụng.']
    },
    {
        title: 'Thỏa thuận cấp phép',
        contents: ['Bằng cách chấp nhận Thỏa thuận này, Tác giả cấp cho Audiory ("Công ty") giấy phép không độc quyền, trên toàn thế giới, miễn phí bản quyền để lưu trữ, hiển thị, phân phối và bán các tác phẩm văn học của Tác giả, bao gồm các câu chuyện, bài báo và nội dung văn bản khác ("Nội dung") trên Ứng dụng trong thời hạn mười (10) năm kể từ ngày chấp nhận.']
    },
    {
        title: 'Quyền sở hữu và bản quyền',
        contents: ['Bằng cách sử dụng Audiory ("Ứng dụng") và chấp nhận các điều khoản và điều kiện này ("Thỏa thuận"), bạn ("Tác giả") đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của Thỏa thuận này, vui lòng không sử dụng Ứng dụng.']
    },
    {
        title: 'Thù lao',
        contents: ['Tác giả sẽ nhận được thù lao bằng kim cương cho các chương do độc giả mua, với mức hoa hồng được khấu trừ theo cấp độ của tác giả như sau:(Tập sự: Hoa hồng 20 %; Ngôi sao mới nổi: Hoa hồng 40 %; Tác giả nổi tiếng: Hoa hồng 50 %)',
            'Ngoài ra, tác giả sẽ nhận được khoản thù lao dưới dạng kim cương cho những món quà nhận được từ độc giả, tuân theo tỷ lệ hoa hồng quà tặng sau đây dựa trên cấp độ của tác giả:( Tập sự: Hoa hồng quà tặng 50%; Ngôi sao mới nổi: Hoa hồng quà tặng 60%; Tác giả nổi tiếng: Hoa hồng quà tặng 70%)',
            'Khi tác giả chọn đặt một truyện thành trả phí, các chương được đăng sau khi áp dụng quyết định này mới có lệ phí, trong khi các chương đã đăng trước đó sẽ vẫn được truy cập miễn phí.',
            'Khi tác giả mới đặt truyện thành trả phí, số kim cương kiếm được từ các chương được mua trong 30 ngày đầu tiên sẽ được đặt trong thời gian đóng băng tạm thời. Điều này được thực hiện để đảm bảo tác giả là người dùng tuân thủ Nguyên tắc Nội dung và Nguyên tắc Cộng đồng của Ứng dụng. Sau thời gian đóng băng 30 ngày đầu tiên, kim cương kiếm được sẽ không còn bị đóng băng nữa và sẽ được chi trả cho tác giả.',
            'Tác giả có thể chọn chuyển số kim cương kiếm được của mình thành tiền thật. Tỷ lệ chuyển đổi từ kim cương sang tiền thật sẽ được xác định theo chính sách và hướng dẫn của Ứng dụng, với giới hạn rút là tối đa 20.000 viên kim cương mỗi tháng.']
    },
    {
        title: 'Quyền riêng tư',
        contents: ['Tác giả đồng ý với Chính sách quyền riêng tư của Ứng dụng, trong đó nêu rõ cách thu thập, sử dụng và bảo vệ dữ liệu cá nhân. Thông tin cá nhân của tác giả sẽ chỉ được sử dụng cho các mục đích được nêu trong Chính sách quyền riêng tư.']
    },
    {
        title: 'Bồi thường',
        contents: ['Tác giả đồng ý bồi thường và giữ cho Công ty không bị tổn hại trước mọi khiếu nại, tổn thất hoặc trách nhiệm pháp lý phát sinh từ việc xuất bản Nội dung trên Ứng dụng, bao gồm mọi hành vi vi phạm bản quyền.']
    },
    {
        title: 'Thay đổi Điều khoản',
        contents: ['Công ty có quyền sửa đổi các điều khoản và điều kiện này bất cứ lúc nào. Tác giả sẽ được thông báo về bất kỳ thay đổi nào và việc tiếp tục sử dụng Ứng dụng sau khi thông báo đó đồng nghĩa với việc chấp nhận các điều khoản đã sửa đổi.']
    },
    {
        title: 'Thông tin liên hệ',
        contents: ['Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về các điều khoản và điều kiện này, vui lòng liên hệ với chúng tôi theo địa chỉ audiory@gmail.com. ', 'Bằng cách chấp nhận các điều khoản và điều kiện này, bạn thừa nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi chúng.']
    },
]

export const PaywalledContract = () => {
    const ContractTermComponent = ({ index, title, contents }) => {
        return <Grid sx={{ marginBottom: 1 }} container spacing={0}>
            <Typography variant="h6" color="initial">{title}</Typography>
            {contents.length === 1 ? <Typography align='justify' variant="body5" color="inherit">{contents}</Typography> : <Grid container spacing={0}>
                {contents.map((content, idx) => (
                    <Typography align='justify' key={idx} variant="body5" color="inherit">{`${index}.${idx + 1}`}. {content}</Typography>

                ))}
            </Grid>}
        </Grid>
    }
    return <>
        <Grid container spacing={0} direction="column">
            <Grid container spacing={0} alignItems="center" sx={{ marginBottom: "2.5em" }}>
                <Typography variant="h4" color="initial">Audiory - Điều khoản và Điều kiện</Typography>
                <Typography variant="body1" color="initial">Cập nhật lần cuối: 10/03/2023
                </Typography>
            </Grid>
            <Grid container spacing={0}>
                {
                    CONTRACT_TERMS.map((term, index) => (
                        <ContractTermComponent key={index} index={index + 1} title={`${index + 1}. ${term.title}`} contents={term.contents} />
                    ))
                }
            </Grid>

        </Grid>
    </>
}