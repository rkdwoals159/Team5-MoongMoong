import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import DateRangePicker from "./DateRangePicker";
import type { DateRangePickerProps } from "./dateRangePicker.type";
const meta = {
  title: "Common/DateRangePicker",
  component: DateRangePicker,
  args: {
    startDate: "2025-12-01",
    endDate: "2026-01-31",
  },
  argTypes: {
    navigationUnit: {
      control: "radio",
      options: ["day", "week", "month"],
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

function DateRangePickerWithState(props: DateRangePickerProps) {
  const {
    startDate: initialStart = "2025-12-01",
    endDate: initialEnd = "2026-01-31",
    ...rest
  } = props;
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  return (
    <DateRangePicker
      {...rest}
      startDate={startDate}
      endDate={endDate}
      onRangeChange={(start, end) => {
        setStartDate(start);
        setEndDate(end);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <DateRangePickerWithState {...args} />,
};

export const WithMinMax: Story = {
  render: (args) => (
    <DateRangePickerWithState
      {...args}
      startDate="2025-06-01"
      endDate="2025-06-30"
      minDate="2025-01-01"
      maxDate="2025-12-31"
    />
  ),
};

export const NavigationByDay: Story = {
  args: {
    navigationUnit: "day",
  },
  render: (args) => (
    <DateRangePickerWithState {...args} startDate="2025-12-15" endDate="2025-12-20" />
  ),
};

export const NavigationByWeek: Story = {
  args: {
    navigationUnit: "week",
  },
  render: (args) => (
    <DateRangePickerWithState {...args} startDate="2025-12-01" endDate="2025-12-07" />
  ),
};

export const NavigationByMonth: Story = {
  args: {
    navigationUnit: "month",
  },
  render: (args) => (
    <DateRangePickerWithState {...args} startDate="2025-12-01" endDate="2026-01-31" />
  ),
};
