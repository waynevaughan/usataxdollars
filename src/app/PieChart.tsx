"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Slice {
  name: string;
  value: number;
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
    const innerRadius = radius * 0.45;

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3
      .pie<Slice>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.015);

    const arc = d3
      .arc<d3.PieArcDatum<Slice>>()
      .innerRadius(innerRadius)
      .outerRadius(radius - 4)
      .cornerRadius(3);

    const arcHover = d3
      .arc<d3.PieArcDatum<Slice>>()
      .innerRadius(innerRadius)
      .outerRadius(radius + 4)
      .cornerRadius(3);

    const tooltip = d3.select(tooltipRef.current);

    const fmt = (n: number) =>
      "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    const arcs = g
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "rgba(10,22,40,0.6)")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .style("transition", "opacity 0.15s");

    arcs
      .on("mouseenter", function (event, d) {
        d3.select(this).transition().duration(150).attr("d", arcHover as any);
        tooltip
          .classed("visible", true)
          .html(
            `<div class="tt-name">${d.data.name}</div>` +
            `<div class="tt-value">${fmt(d.data.value)} (${((d.data.value / d3.sum(data, (x) => x.value)) * 100).toFixed(1)}%)</div>`
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

    /* Center label */
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("letter-spacing", "1.5px")
      .text("YOUR");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("letter-spacing", "1.5px")
      .text("TAXES");

  }, [data]);

  return (
    <>
      <svg ref={svgRef} width="100%" height="100%" />
      <div ref={tooltipRef} className="d3-tooltip" />
    </>
  );
}
