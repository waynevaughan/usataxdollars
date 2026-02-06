"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Slice {
  name: string;
  value: number;
  pct: number;
  color: string;
}

export default function PieChart({ data }: { data: Slice[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.42;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<Slice>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.012);

    const arc = d3
      .arc<d3.PieArcDatum<Slice>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 2)
      .cornerRadius(2);

    const arcHover = d3
      .arc<d3.PieArcDatum<Slice>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 6)
      .cornerRadius(2);

    const tooltip = d3.select(tooltipRef.current);

    const fmt = (n: number) =>
      "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    g.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(150).attr("d", arcHover as any);
        tooltip
          .classed("visible", true)
          .html(
            `<div class="tt-name">${d.data.name}</div>` +
            `<div class="tt-pct">${fmt(d.data.value)} · ${d.data.pct.toFixed(1)}%</div>`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 14 + "px")
          .style("top", event.pageY - 14 + "px");
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(150).attr("d", arc as any);
        tooltip.classed("visible", false);
      });

    /* Center text */
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.1em")
      .attr("fill", "#999")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("letter-spacing", "2px")
      .attr("font-family", "Inter, sans-serif")
      .text("YOUR");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.1em")
      .attr("fill", "#999")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("letter-spacing", "2px")
      .attr("font-family", "Inter, sans-serif")
      .text("TAXES");

  }, [data]);

  return (
    <>
      <svg ref={svgRef} width="100%" height="100%" />
      <div ref={tooltipRef} className="d3-tooltip" />
    </>
  );
}
