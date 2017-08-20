 var addCircles = function (gradeCount, className) { 
    console.log(className + " : " + Math.floor(gradeCount));

    for(var c = 0; c < gradeCount; c++) {

        svg.append("circle")
            .attr("cx", xPos)
            .attr("cy", yPos)
            .attr("r", 2)
            .attr("class", className)
            .style("opacity", 0)
        }

}


////////////// SPREAD CIRCLES 

var spreadCircles = function () { 
        var newX = 0, 
            newY = height - 30,
            newColCount = 0,
            newRowCount = 0,
            newColCountLimit = 100,
            newRadius = 1.5,
            newSpacing = 2;
        
        // calculate values
        
        var circles = d3.selectAll("circle").size();
        var area = (width) * (height / 2.2); 
        console.log(area);
        var squares = area / circles;
        squares = Math.sqrt(squares); 
        console.log(squares);
//        newRadius = squares * 0.5; 
//        newSpacing = squares * 0.5; 
        newColCountLimit = (width - 7) / (newRadius * 2 + newSpacing);
        
        d3.selectAll("circle")
            .attr("cx", function (d, i) { 
                
                newColCount++;
                if(newColCount > newColCountLimit) { newColCount = 0; newX = 0; }
                 
                newX = newX + newRadius * 2 + newSpacing; 
            
                return newX - width;
                
            })
//            .attr("cx", width + 20)
            .attr("cy", function (d) { 
                newRowCount++; 
                
                if(newRowCount > newColCountLimit) { newRowCount = 0;  newY = newY - newRadius * 2 - newSpacing; }
                
                return newY;
            })
//            .attr("cy", -20)
            .attr("r", newRadius)
            .style("opacity", 0)
            .style("fill", "fffcbc")
    
   
    
    
}


var makeBars = function (className, labelName, year, labelClass, start, label, ref) { 
        if(!start) { xPos = startXpos = startXpos + (radius * 2 + spacing) * (colLimit + 2);  yPos = height - 30; } 
        
        else { xPos = 0;  }
        startXpos = xPos,
            colCount = 0;
    
    svg.append("text")
        .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
        .attr("y", height - 5)
        .html(year)
        .attr("class", "barLabels")
        .style("text-anchor", "middle")
        .style("opacity", 0)
        .transition() 
        .delay(1000)
        .duration(1000)
        .style("opacity", 1)
           
    
    var c = d3.selectAll(".grade7").size();
    
//    if(ref) { var col = "#85f2e0"}
//    else { var col = "fffcbc"; }
    var col = "fffcbc";
    
    if(!ref) { 
    
    d3.selectAll(className)
        .each( function (d, i) { 
            d3.select(this)
                .transition()
                .delay( function () { 
                    return randomInt(5,500);
                })
                .duration(2000)
                .attr("cx", xPos)
                .attr("cy", yPos)
                .attr("r", radius)
                .style("fill", col)
                .style("opacity", 1)
        
            xPos = xPos + spacing + radius * 2;
            colCount++; 
            
            if(colCount === colLimit) { 
                colCount = 0; 
                xPos = startXpos;
                yPos = yPos - spacing - radius * 2;
            }
        })
        
    }
    
    else { 
        
        d3.selectAll(className)
        .each( function (d, i) { 
            d3.select(this)
                .classed("diff", function () { 
                    if(i < c) return "false";
                    else return true;
                })
                .transition()
                .delay( function () { 
                    return randomInt(5,500);
                })
                .duration(2000)
                .attr("cx", xPos)
                .attr("cy", yPos)
                .attr("r", radius)
                .style("fill", col)
                
                .style("opacity", function () { 
                    if(i < c) return 1;
                    else return 0; 
                })
                .style("fill", function () { 
                    if(i < c) return "#fffcbc";
                    else return "#85f2e0";
                })
        
            xPos = xPos + spacing + radius * 2;
            colCount++; 
            
            if(colCount === colLimit) { 
                colCount = 0; 
                xPos = startXpos;
                yPos = yPos - spacing - radius * 2;
            }
        })
        
//        setTimeout( function () { 
//            d3.selectAll(".diff").transition().duration(2000).style("opacity", 1)
//            
//        }, 3000)
        
        
        
//        svg.append("line")
//            .attr("x1", 0)
//            .attr("x2", width)
//            .attr("y1", yPos - 5)
//            .attr("y2", yPos - 5)
//            .style("stroke", "#fff")
//            .style("stroke-width", 1)
    
    }
    
    
    
    // get top position
    
    if(label) { 
        
        
        var labelAnchor = yPos - 10 - 80;
        
        var labels = svg.append("g").attr("class", labelName)
        
        setTimeout( function ()  { 
        labels.append("line")
            .attr("y1", yPos - 10 - 80)
            .attr("y2", function () { 
                if(ref) return yPos + 65; 
                else return yPos -10; 
            })
            .attr("x1", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
            .attr("x2", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
            .style("stroke", "#fff")
            .style("stroke-width", 1)
            .attr("class", function () { 
                if(ref) { return "grade7line"}
            })
    
        labels.append("circle")
            .attr("cx", startXpos + ((radius * 2 + spacing) * colLimit) / 2 )
            .attr("cy", yPos - 10 - 80)
            .attr("r", 4)
            .style("fill", "#fff")
            
        
//        labels.append("text")
//            .attr("x", startXpos + 10 + ((radius * 2 + spacing) * colLimit) / 2 )
//            .attr("y", yPos - 10 - 80)
//            .html(labelText)
//            .attr("class", "chartLabels")
            var pos = $("svg").position();
            
            d3.select(labelClass)
                .style("left", pos.left + 30 + startXpos + ((radius * 2 + spacing) * colLimit) / 2 + "px")
                .style("top", labelAnchor + "px")
//                .style("left", pos.left + startXpos + ((radius * 2 + spacing) * colLimit) / 2 + "px")
//            
        }, 2000);
            
    }
            
    
    
        
            
        

            
    
//        
//        for(var c = 0; c < gradeCount; c++) {
//            
//            svg.append("circle")
//                .attr("cx", xPos)
//                .attr("cy", yPos)
//                .attr("r", radius)
//                .style("fill", color)
//                .style("stroke", "none")
//                .attr("class", className)
//                .style("opacity", 0)
//        
//            xPos = xPos + spacing + radius * 2;
//            colCount++; 
//            
//            if(colCount === colLimit) { 
//                colCount = 0; 
//                xPos = startXpos;
//                yPos = yPos - spacing - radius * 2;
//            }
//        }
//        yPos = height;
    }