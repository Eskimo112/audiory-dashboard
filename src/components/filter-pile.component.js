import React from 'react';

import { Stack, Typography } from '@mui/material';

import { FilterChip } from './filter-chip.component';

const FilterPile = (props) => {
  const { title, contents, onDelete } = props;
  if (contents.length === 0) return;
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="8px"
      display="flex"
      padding="6px 8px"
      borderRadius="8px"
      sx={(theme) => ({ border: '1px dashed', borderColor: 'sky.main' })}>
      <Typography variant="body2" color="ink.main">
        {title}
      </Typography>
      {contents.map((value) => (
        <FilterChip
          key={value}
          text={value}
          onDelete={() => {
            onDelete(value);
          }}
        />
      ))}
    </Stack>
  );
};

export default FilterPile;
