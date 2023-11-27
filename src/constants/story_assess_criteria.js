import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'






const CONTRACT_TERMS = [
    {
        title: 'Điều kiện ký hợp đồng',
        contents: ['Tác phẩm đang đăng tải trên App, đã cập nhật được tối thiểu 5 chương,1.000 lượt đọc và đạt 10.000 chữ trở lên có thể xin ký hợp đồng.',
            'Tác giả phải có ít nhất 100 người theo dõi, ít nhất 3 truyện được đăng trong 365 ngày gần đây',
            'Tác giả phải đảm bảo tác phẩm là nguyên tác và có bản quyền toàn diện.',
            'Tác phẩm không có các nội dung vi phạm liên quan đến chính trị, không sao chép, đạo nhái tác phẩm khác.',
            '* Sau khi đáp ứng đầy đủ các điều kiện trên, và nhấn xác nhận thương mại hóa, nền tảng sẽ xét duyệt hợp đồng và tác phẩm của bạn.'
        ]
    },
    {
        title: 'Các quyền lợi khi thương mại hóa',
        contents: [
            'Tác phẩm ký hợp đồng độc quyền sẽ được nhận lợi nhuận từ việc mua chương',
            'Tác phẩm ký hợp đồng độc quyền sẽ được hỗ trợ phân phát đề xuất lưu lượng tiếp cận độc giả',
        ]
    },
    {
        title: 'Nghĩa vụ của tác giả ký hợp đồng',
        contents: [
            'Tác giả đảm bảo tác phẩm là nguyên tác và có bản quyền toàn diện,không chứa các nội dung vi phạm pháp luật, liên quan chính trị...',
            'Trong thời gian ký hợp đồng, tác giả ủy quyền độc quyền về bản quyền điện tử, xuất bản, chuyển thể cho phía nền tảng.',
            'Trong thời gian ký hợp đồng, tác giả không được phép đăng tải tác phẩm lên bất kỳ nền tảng nào khác, nếu đã đăng thì phải xóa.'
        ]
    },


]

export const StoryAssesCriteria = () => {
    const ContractTermComponent = ({ index, title, contents }) => {
        return <Grid sx={{ marginBottom: 1 }} container spacing={0}>
            <Typography variant="h6" color="initial">{title}</Typography>
            {contents.length === 1 ? <Typography align='justify' variant="body2" color="inherit">{contents}</Typography> : <Grid container spacing={0}>
                {contents.map((content, idx) => (
                    <Typography align='justify' key={idx} variant="body2" color="inherit">{idx === 4 ? '' : `${idx + 1}.`} {content}</Typography>

                ))}
            </Grid>}
        </Grid>
    }
    return <>
        <Grid container spacing={0} direction="column">
            <Grid container spacing={0} alignItems="center" sx={{ marginBottom: "1em" }}>
                <Typography variant="h5" color="initial">Chi tiết về việc thương mại hóa</Typography>
                {/* <Typography variant="body1" color="initial">Cập nhật lần cuối: 10/03/2023
                </Typography> */}
            </Grid>
            <Grid container spacing={0}>
                {
                    CONTRACT_TERMS.map((term, index) => (
                        <ContractTermComponent key={index} index={index + 1} title={` ${term.title}`} contents={term.contents} />
                    ))
                }
            </Grid>

        </Grid>
    </>
}