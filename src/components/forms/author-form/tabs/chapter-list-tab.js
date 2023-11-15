import React from "react";

import { useRouter } from "next/router";

import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { MoreVert } from "@mui/icons-material";
import { Button, Grid, IconButton, Popover, Typography } from "@mui/material";

import ConfirmDialog from "@/components/dialog/reuse-confirm-dialog";
import { useRequestHeader } from "@/hooks/use-request-header";
import ChapterService from "@/services/chapter";
import { countDiffenceFromNow, formatDate } from "@/utils/formatters";
import { toastError, toastSuccess } from "@/utils/notification";

const ChapterListTab = ({ list, storyId, refetch, onPublish, onPreview, onDelete }) => {
    const router = useRouter();
    const requestHeader = useRequestHeader();
    console.log(list)

    const ChapterCard = ({ chapter, index }) => {
        const handleNavigate = () => {
            router.push(`/my-works/${storyId}/write/${chapter.id}`);
        }
        const [anchorEl, setAnchorEl] = React.useState(null);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };
        const open = Boolean(anchorEl);
        const id = open ? 'simple-popover' : undefined;

        const [isOpen, setIsOpen] = React.useState(false)
        const handleDialogOpen = () => {
            console.log('open')
            setIsOpen(true);
        }
        const handleDialogClose = (isConfirm, id) => {
            setIsOpen(false);
            if (isConfirm === true) {
                onDelete({ chapterId: id })
            }
        }

        const isDraft = chapter.is_draft;
        const isLast = list.length === 1;
        return (
            <Button fullWidth color={isDraft ? 'inherit' : "inherit"} variant='text' key={index} sx={{ marginTop: "0.5em", backgroundColor: !isDraft ? 'primary.lightest' : 'sky.lightest' }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    wrap="wrap"
                >

                    <Grid xs={8} spacing={0} container justifyContent="flex-start" onClick={handleNavigate}>
                        <Grid container spacing={0} direction="column" alignItems="flex-start">

                            <Typography variant="subtitle1" noWrap sx={{ paddingRight: "2em", fontWeight: isDraft ? "normal" : "bold" }}>Chương {index + 1}: {chapter?.title ?? 'Tiêu đề chương'}   </Typography>
                            <Typography color={isDraft ? 'ink.main' : 'ink.main'} variant="subtitle2" noWrap sx={{ paddingRight: "2em", fontWeight: isDraft ? "normal" : "bold" }}>  {isDraft ? 'Bản thảo ' : 'Đã đăng tải '} {formatDate(chapter.updated_date ?? chapter?.created_date).split(' ')[0]} </Typography>

                        </Grid>
                    </Grid>
                    {chapter?.price !== 0 ? <Grid xs={1} container justifyContent="flex-start" alignItems="center" onClick={handleNavigate}>
                        {chapter?.price} <CurrencyDollarIcon width="1.5em" color="primary" />
                    </Grid> : <></>}
                    <Grid xs={3} spacing={0} container direction="row" alignItems="center" justifyContent="space-between">
                        {countDiffenceFromNow(chapter.updated_date)} <IconButton sx={{ marginLeft: "0.2em" }} variant="text" color="primary" onClick={handleClick}>
                            <MoreVert />
                        </IconButton>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}

                        >
                            <Grid container direction="column">

                                <Button variant="text" color="primary" onClick={() =>
                                    onPreview({ chapterId: chapter.id })
                                }>
                                    Xem trước
                                </Button>
                                {chapter.is_draft ? <Button variant="text" color="primary" onClick={() => onPublish({ chapterId: chapter.id, isPublish: true })}>
                                    Đăng tải
                                </Button> : !chapter.is_paywalled ? <Button variant="text" color="primary" onClick={() => onPublish({ chapterId: chapter.id, isPublish: false })}>
                                    Gỡ đăng tải
                                </Button> : <></>}
                                {!chapter.is_paywalled ? <Button variant="text" color="secondary" onClick={() => handleDialogOpen()}>
                                    Xóa chương
                                </Button> : <></>}
                                <ConfirmDialog
                                    title={`Xác nhận xóa chương ${chapter.title}`}
                                    actionBgColor='secondary'
                                    isReverse={true}
                                    content={<Grid container direction="column" >
                                        {isLast && !chapter.is_draft ? <Typography><strong>Hành động này không thể hoàn tác</strong></Typography> : <></>
                                        }
                                        <Typography>Tất cả <strong>lượt đoc</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                                        <Typography>Tất cả <strong>bình luận</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                                        <Typography>Tất cả <strong>bình luận</strong> , nội dung sẽ bị <strong>xóa</strong></Typography>
                                        {isLast && !chapter.is_draft ? <Typography><strong>Truyện cũng sẽ bị xóa</strong></Typography> : <></>
                                        }
                                    </Grid>}
                                    isOpen={isOpen}
                                    handleClose={() => { handleDialogClose(true, chapter.id) }}
                                    actionContent='Xác nhận xóa'
                                    cancelContent='Hủy thao tác'
                                />
                            </Grid>

                        </Popover>
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
            await new ChapterService(requestHeader).create(body).then(res => {
                refetch(true);

                toastSuccess("Tạo chương mới thành công")
            })

        } catch (error) {
            toastError('Tạo chương không thành công')

        }
    }
    return (
        <>
            <Button onClick={handleCreateChapter} sx={{ height: "4em" }} fullWidth variant="contained" startIcon={<PlusIcon />}>
                <Typography variant="subtitle1">Tạo chương mới</Typography>
            </Button>
            {list.map((chapter, index) => (
                <div key={index}>
                    <ChapterCard chapter={chapter} index={index} />

                </div>
            ))
            }
        </>
    )
}
export default ChapterListTab;