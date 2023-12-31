import React, { useState } from 'react';

import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from 'react-query';

import { useRequestHeader } from '../../../hooks/use-request-header';
import ChapterVersionService from '../../../services/chapter-version';
import { formatNumberToFixed } from '../../../utils/formatters';

const MODERATION_MAP = {
  Profanity: 'Thô tục',
  Sexual: 'Tình dục',
  Politics: 'Chính trị',
  Violent: 'Bạo lực',
};

const ModerationModal = ({ chapterVersionId, handleClose }) => {
  const requestHeader = useRequestHeader();
  const [currentModeration, setCurrentModeration] = useState(null);
  const { data: paras = [], isLoading } = useQuery(
    ['chapters', chapterVersionId, 'moderations'],
    async () =>
      await new ChapterVersionService(requestHeader).getModerationId(
        chapterVersionId,
      ),
    { refetchOnWindowFocus: false },
  );

  return (
    <Modal
      open={true}
      onClose={handleClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Box
        sx={{
          width: '50%',
        }}>
        <Stack
          spacing={2}
          sx={{
            padding: '24px',
            display: 'flex',
            bgcolor: 'white',
            width: '100%',
            height: '80vh',
            overflow: 'auto',
            borderRadius: 2,
          }}>
          {!isLoading ? (
            <Stack gap="16px">
              <Typography variant="body2" textAlign="center" color="error">
                (Đoạn vi phạm có màu đỏ. Nhấn vào từng đoạn để xem báo cáo chi
                tiết)
              </Typography>
              {paras.map((p, index) => {
                return p.content_moderation.map((moderation) => {
                  const isMatured = moderation.is_mature;
                  const isReactionary = moderation.is_reactionary;
                  return moderation.type === 'IMAGE' && moderation.image ? (
                    <Box
                      sx={{
                        width: '50%',
                        padding: '8px',
                        bgcolor:
                          isMatured || isReactionary ? 'error.alpha20' : '',
                        borderRadius: '8px',
                      }}>
                      <Typography
                        variant="body2"
                        textAlign="center"
                        color="error">
                        Ảnh có nội dung trưởng thành
                      </Typography>
                      <Box
                        width="100%"
                        component="img"
                        sx={{ filter: 'blur(8px)' }}
                        src={moderation.image}></Box>
                    </Box>
                  ) : (
                    <Button
                      key={moderation.id}
                      variant="text"
                      onClick={() => setCurrentModeration(moderation)}
                      sx={{
                        cursor: 'pointer',
                        textAlign: 'left',
                        justifyContent: 'start',
                        position: 'relative',
                        ':hover': {
                          bgcolor:
                            isMatured || isReactionary ? 'error.alpha30' : '',
                        },
                        ':active': {
                          bgcolor:
                            isMatured || isReactionary ? 'error.alpha50' : '',
                        },
                        bgcolor:
                          isMatured || isReactionary ? 'error.alpha20' : '',
                      }}>
                      <Typography variant="reading1" color="ink.main">
                        {p.content}
                      </Typography>
                    </Button>
                  );
                });
              })}
            </Stack>
          ) : (
            <CircularProgress></CircularProgress>
          )}
        </Stack>
        {currentModeration && (
          <Dialog
            open={Boolean(currentModeration)}
            onClose={() => setCurrentModeration(null)}
            PaperProps={{
              sx: {
                width: '500px',
                maxHeight: '90%',
                borderRadius: 3,
              },
            }}>
            <DialogTitle sx={{ m: 0, p: 2 }}>Chi tiết kiểm duyệt</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => setCurrentModeration(null)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}>
              <Close />
            </IconButton>
            <DialogContent dividers>
              <Stack gap="8px">
                <Stack
                  width="100%"
                  justifyContent="space-between"
                  direction="row">
                  <Typography variant="body1">
                    Nội dung trưởng thành:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={
                      currentModeration.is_mature
                        ? 'error.main'
                        : 'success.main'
                    }>
                    {currentModeration.is_mature ? 'Có' : 'Không'}
                  </Typography>
                </Stack>
                <Stack
                  width="100%"
                  justifyContent="space-between"
                  direction="row">
                  <Typography variant="body1">Nội dung chính trị:</Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={
                      currentModeration.is_reactionary
                        ? 'error.main'
                        : 'success.main'
                    }>
                    {currentModeration.is_reactionary ? 'Có' : 'Không'}
                  </Typography>
                </Stack>
                <Typography variant="body1" fontWeight={600}>
                  Báo cáo:
                </Typography>
                <Stack
                  padding="8px 16px"
                  sx={{
                    bgcolor: 'ink.alpha10',
                    borderRadius: '8px',
                    gap: '8px',
                  }}>
                  {currentModeration.result.map((item, index) => (
                    <Stack
                      key={index}
                      width="100%"
                      justifyContent="space-between"
                      direction="row">
                      <Typography variant="body2">
                        {MODERATION_MAP[item.criteria_id]}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatNumberToFixed(item.confidence, 4)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </Modal>
  );
};

export default ModerationModal;
