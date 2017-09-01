import React, { Component } from 'react';
import styled from 'styled-components';
import MonthHeader from './MonthHeader';
import WeekHeader from './WeekHeader';
import Month from './Month';
import { defaultUtils as utils } from './dateUtils';
import CalendarToolbar from './CalendarToolbar';
import CalendarButtons from './CalendarButtons';
import DateDisplay from './DateDisplay';

const Root = styled.div`
  color: rgba(0, 0, 0, 0.87);
  user-select: none;
  ${({ hideCalendarDate }) => !hideCalendarDate && 'width: 479px'};
  overflow: hidden;
`;

const CalendarContainer = styled.div`
  display: flex;
  place-content: space-between;
  flex-direction: column;
  font-size: 12px;
  font-weight: 400;
  padding: 0px 8px;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
`;

const StyledCalendar = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 330px;
`;

class Calendar extends Component {
  onMove = (view, isForward) => {
    this.refs.weeks.moveTo(view, isForward);
  };

  static defaultProps = {
    disableYearSelection: false,
    initialDate: new Date()
  };

  state = {
    displayDate: undefined,
    displayMonthDay: undefined,
    selectedDate: undefined,
    transitionDirection: 'left',
    open: false,
    transitionEnter: true
  };

  componentWillMount() {
    this.setState({
      displayDate: utils.getFirstDayOfMonth(this.props.initialDate),
      selectedDate: this.props.initialDate,
      displayMonthDay: !this.props.openToYearSelection
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialDate !== this.props.initialDate) {
      const date = nextProps.initialDate || new Date();
      this.setState({
        displayDate: utils.getFirstDayOfMonth(date),
        selectedDate: date
      });
    }
  }

  getMinDate() {
    return this.props.minDate || utils.addYears(new Date(), -100);
  }

  getMaxDate() {
    return this.props.maxDate || utils.addYears(new Date(), 100);
  }

  getSelectedDate() {
    return this.state.selectedDate;
  }

  onTransitionEnd = () => {
    this.refs.monthHeader.enable();
  };

  getToolbarInteractions() {
    return {
      prevMonth: utils.monthDiff(this.state.displayDate, this.getMinDate()) > 0,
      nextMonth: utils.monthDiff(this.state.displayDate, this.getMaxDate()) < 0
    };
  }

  handleMonthChange = months => {
    const direction = months >= 0 ? 'left' : 'right';
    this.setState({
      transitionDirection: direction,
      displayDate: utils.addMonths(this.state.displayDate, months)
    });
  };

  calendarRefs = {};

  render() {
    const toolbarInteractions = this.getToolbarInteractions();
    return (
      <Root
        hideCalendarDate={this.props.hideCalendarDate}
        visible={this.props.visible}
      >
        <DateDisplay selectedDates={this.props.selectedDates} />
        <StyledCalendar>
          <CalendarContainer>
            <CalendarToolbar
              displayDate={this.state.displayDate}
              onMonthChange={this.handleMonthChange}
              prevMonth={toolbarInteractions.prevMonth}
              nextMonth={toolbarInteractions.nextMonth}
            />
            <WeekHeader />
            <Month
              ref="weeks"
              view={this.props.view}
              selected={this.props.selected}
              displayDate={this.state.displayDate}
              key={this.state.displayDate.toDateString()}
              selectedDates={this.props.selectedDates}
              onTransitionEnd={this.onTransitionEnd}
              minDate={this.getMinDate()}
              maxDate={this.getMaxDate()}
              onSelect={this.props.onSelect}
              ref={ref => (this.calendarRefs.calendar = ref)}
              minDate={this.props.minDate}
              maxDate={this.props.maxDate}
            />
          </CalendarContainer>
          <CalendarButtons
            onCancel={this.props.onCancel}
            onOk={this.props.onOk}
          />
        </StyledCalendar>
      </Root>
    );
  }
}

export default Calendar;
