import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSidebar } from "@/contexts/SidebarContext";
import { IconLayoutGrid, IconCalendarEvent } from "@tabler/icons-react";
import { getTopicIcon } from "@/utils/topicUtils";

const Sidebar = ({
  topics,
  filters,
  setFilters,
  onClearFilters,
}) => {
  const { isMobileSidebarOpen, isTopicOpen, setIsTopicOpen } = useSidebar();

  const handleFilterToggle = (type, name) => {
    if (name === "all") {
      const sourceArray = topics;
      const allSelected = {};
      // If currently all are selected, deselect all. Otherwise select all.
      const currentlyAll = sourceArray.every(item => filters[type][item]);
      sourceArray.forEach((item) => {
        allSelected[item] = !currentlyAll;
      });
      setFilters((prev) => ({ ...prev, [type]: allSelected }));
    } else {
      // If all topics are currently selected, clicking one should exclusively select only that one
      const allCurrentlySelected = topics.every(item => filters[type][item]);
      if (allCurrentlySelected) {
        const exclusive = {};
        topics.forEach(t => { exclusive[t] = (t === name); });
        setFilters((prev) => ({ ...prev, [type]: exclusive }));
      } else {
        setFilters((prev) => ({
          ...prev,
          [type]: { ...prev[type], [name]: !prev[type][name] },
        }));
      }
    }
  };

  const handleDateChange = (date, name) => {
    setFilters((prev) => ({ ...prev, [name]: date }));
  };

  const areAllTopicsSelected =
    topics &&
    topics.length > 0 &&
    topics.every((topic) => filters?.topics?.[topic]);

  // Auto-select all topics when topic list changes and none are selected
  useEffect(() => {
    if (topics && topics.length > 0) {
      const hasAnySelected = topics.some(t => filters?.topics?.[t]);
      if (!hasAnySelected) {
        const allSelected = {};
        topics.forEach(t => { allSelected[t] = true; });
        setFilters(prev => ({ ...prev, topics: allSelected }));
      }
    }
  }, [topics]);



  return (
    <aside className={`tn-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>

      <div className="tn-sidebar-collapsible open">
          <div className="tn-filter-group">
            <div 
              className="tn-section-label" 
              onClick={() => setIsTopicOpen(!isTopicOpen)}
            >
              Topics
              <span className={`tn-chevron ${isTopicOpen ? 'open' : ''}`}>
                {isTopicOpen ? '−' : '+'}
              </span>
            </div>
            
            {isTopicOpen && (
              <div className="tn-filter-dropdown">
                <label 
                  className={`tn-filter-chip ${areAllTopicsSelected ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}
                >
                  <input 
                    type="checkbox"
                    className="tn-checkbox"
                    checked={areAllTopicsSelected}
                    onChange={() => handleFilterToggle('topics', 'all')}
                  />
                  <IconLayoutGrid />
                  <span>All Topics</span>
                </label>
                {topics.map(topic => (
                  <label 
                    key={topic}
                    className={`tn-filter-chip ${filters?.topics?.[topic] ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}
                  >
                    <input 
                      type="checkbox"
                      className="tn-checkbox"
                      checked={!!filters?.topics?.[topic]}
                      onChange={() => handleFilterToggle('topics', topic)}
                    />
                    {getTopicIcon(topic)}
                    <span>{topic}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="tn-filter-group">
            <div className="tn-section-label">Time frame</div>
            
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--aster)', opacity: 0.8, marginBottom: 4 }}>From</div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--chip-bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px' }}>
                <IconCalendarEvent size={16} color="var(--aster)" style={{ marginRight: 8 }} />
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  placeholderText="Any"
                  className="tn-search"
                  popperContainer={({ children }) => createPortal(children, document.body)}
                />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--aster)', opacity: 0.8, marginBottom: 4 }}>To</div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--chip-bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px' }}>
                <IconCalendarEvent size={16} color="var(--aster)" style={{ marginRight: 8 }} />
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  dateFormat="yyyy-MM"
                  showMonthYearPicker
                  placeholderText="Any"
                  className="tn-search"
                  popperContainer={({ children }) => createPortal(children, document.body)}
                />
              </div>
            </div>
          </div>

          <div className="tn-filter-group">
            <button className="tn-nav-btn" style={{ width: '100%', padding: '10px 0', fontSize: '13px' }} onClick={onClearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>

    </aside>
  );
};

export default Sidebar;