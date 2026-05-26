// Chart.js Plugin for Value Labels
export const ARAYA_VALUE_LABELS = {
  id: 'arayaValueLabels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;

    const isDoughnut = ['doughnut', 'pie'].includes(chart.config.type);
    const formatValue = (n) => {
      const val = Number(n);
      if (!Number.isFinite(val)) return n ?? '';
      return val.toLocaleString('es-ES', { maximumFractionDigits: 1 });
    };

    if (isDoughnut) {
      // Doughnut labels
      const labels = [];
      chart.data.datasets.forEach((dataset, di) => {
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((arc, i) => {
          const val = Number(dataset.data[i]);
          if (!Number.isFinite(val) || val === 0) return;
          const angle = (arc.startAngle + arc.endAngle) / 2;
          const r = arc.outerRadius + 13;
          const x = arc.x + Math.cos(angle) * r;
          const y = arc.y + Math.sin(angle) * r;
          labels.push({ text: formatValue(val), x, y, side: Math.cos(angle) >= 0 ? 'left' : 'right' });
        });
      });

      labels.forEach(l => {
        ctx.save();
        ctx.font = '500 9.5px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif';
        ctx.textAlign = l.side === 'left' ? 'left' : 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(247,243,234,.86)';
        if (document.documentElement.getAttribute('data-theme') === 'light') {
          ctx.fillStyle = 'rgba(23,18,13,.78)';
        }
        ctx.fillText(String(l.text), l.x, l.y);
        ctx.restore();
      });
    } else {
      // Bar/Line labels
      chart.data.datasets.forEach((dataset, di) => {
        if (dataset.hidden) return;
        const meta = chart.getDatasetMeta(di);
        meta.data.forEach((el, i) => {
          const raw = dataset.data[i];
          if (raw == null) return;
          const val = typeof raw === 'object' ? (raw.y ?? raw.x) : raw;
          if (Number(val) === 0) return;

          const text = formatValue(val);
          const pos = el.tooltipPosition();

          ctx.save();
          ctx.font = '500 9.5px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'rgba(247,243,234,.86)';
          if (document.documentElement.getAttribute('data-theme') === 'light') {
            ctx.fillStyle = 'rgba(23,18,13,.78)';
          }
          ctx.fillText(String(text), pos.x, pos.y - 10 - (di * 8));
          ctx.restore();
        });
      });
    }
  }
};
