import { useRouter } from 'next/router';

import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import {
  Comment,
  CommentOutlined,
  Favorite,
  Menu,
  MenuBook,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from '@mui/material';

import { formatStatistic } from '../utils/formatters';

export const StoryCard = ({ story }) => {
  const router = useRouter();
  const theme = useTheme();
  const DetailInfo = ({ icon, number }) => {
    return (
      <>
        <Stack
          direction="row"
          justifyContent="flex-start"
          gap="2px"
          alignItems="center">
          <SvgIcon
            sx={{
              width: '14px',
              color: 'primary.secondary',
              strokeWidth: 3,
            }}>
            {icon ?? <MenuBook></MenuBook>}
          </SvgIcon>
          <Typography component="div" variant="body2" fontSize="14px">
            {number}
          </Typography>
        </Stack>
      </>
    );
  };

  return (
    <>
      <Card
        elevation={2}
        onClick={() => {
          router.push(`/my-works/${story.id}`);
        }}
        sx={{
          display: 'flex',
          width: '100%',
          cursor: 'pointer',
          paddingBottom: 0,
        }}>
        <CardMedia
          component="img"
          sx={{
            width: '105px',
            minWidth: '105px',
            height: '150px',
            objectFit: 'cover',
          }}
          src={
            story.cover_url !== ''
              ? story.cover_url
              : 'https://imgv3.fotor.com/images/gallery/Fiction-Book-Covers.jpg'
          }
          alt="cover image"
        />
        <CardContent
          sx={{
            boxSizing: 'border-box',
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'column',
            padding: '12px',
            pl: '24px',
            pb: '12px!important',
          }}>
          <Stack direction="column" gap="8px">
            <Stack gap="4px">
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  component="div"
                  variant="h6"
                  sx={{
                    whiteSpace: 'wrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                  {story.title}
                </Typography>
                {story.is_paywalled && (
                  <Typography
                    component="div"
                    fontWeight={600}
                    variant="body2"
                    color={
                      story.is_paywalled ? 'primary.main' : 'secondary.main'
                    }>
                    {story.is_paywalled ? 'Truyện trả phí' : 'Truyện miễn phí'}
                  </Typography>
                )}
              </Stack>
              <Stack direction="row" gap="12px">
                <DetailInfo
                  icon={<EyeIcon></EyeIcon>}
                  number={formatStatistic(story.read_count ?? 0)}
                />
                <DetailInfo
                  icon={<Favorite></Favorite>}
                  number={formatStatistic(story.vote_count ?? 0)}
                />
                <DetailInfo
                  icon={<Menu></Menu>}
                  number={formatStatistic(story.published_count ?? 0)}
                />
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'wrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'ink.lighter',
                  fontStyle: 'italic',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                {story.description}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                gap: '4px',
                alignItems: 'center',
              }}>
              {story.is_completed && (
                <Stack
                  sx={{
                    bgcolor: 'primary.lightest',
                    fontSize: '12px',
                    borderRadius: '20px',
                    padding: '4px 8px',
                  }}>
                  Hoàn thành
                </Stack>
              )}
              {story.tags
                .slice(0, Math.min(story.tags.length, 3))
                .map((tag) => (
                  <Stack
                    key={tag.id}
                    sx={{
                      bgcolor: 'sky.lightest',
                      fontSize: '12px',
                      borderRadius: '20px',
                      padding: '4px 8px',
                    }}>
                    {tag.name}
                  </Stack>
                ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};
