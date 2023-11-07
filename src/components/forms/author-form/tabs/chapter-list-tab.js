import { useRouter } from "next/router";

import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Button, Grid, Typography } from "@mui/material";
import ChapterService from "@/services/chapter";
import { toastError, toastSuccess } from "@/utils/notification";

const ChapterListTab = ({ list, storyId }) => {
    const router = useRouter();
    console.log(list)
    const ChapterCard = ({ chapter, index }) => {
        const isDraft = chapter.is_draft;
        return (
            <Button onClick={() => { router.push(`/my-works/${storyId}/write/${chapter.id}`) }} fullWidth color="inherit" variant={isDraft ? 'outlined' : 'contained'} key={index} sx={{ marginTop: "0.5em", backgroundColor: isDraft ? 'primary.lightest' : 'sky.lightest' }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    wrap="wrap"
                >
                    <Grid xs={10} spacing={0} container justifyContent="flex-start">
                        <Typography variant="subtitle1">Chương {index + 1}: {chapter.title ?? 'Tiêu đề chương'}  {isDraft ? '( Bản thảo )' : ''} </Typography>
                    </Grid>
                    <Grid xs={2} spacing={0}>
                        20 gio truoc
                    </Grid>

                </Grid>
            </Button>
        )
    }
    const handleCreateChapter = async () => {
        const body = {
            position: list.length + 1, story_id: storyId
        };
        try {
            await ChapterService.create(body)
            toastSuccess("Tạo chương mới thành công")
        } catch (error) {
            toastError('Tạo chương không thành công')

        }
    }
    return (
        <>
            <Button onClick={handleCreateChapter} fullWidth variant="contained" startIcon={<PlusIcon />}>
                <Typography variant="subtitle1">Tạo chương mới</Typography>
            </Button>
            {list.map((chapter, index) => (
                ChapterCard({ chapter, index })
            ))}
        </>
    )
}
export default ChapterListTab;